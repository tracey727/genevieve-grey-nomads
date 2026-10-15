const targets = [
  ['bitter-art-35680057', 'br-flat-mouse-auo0cs78', 'ORIGINAL_GREY_NOMADS'],
  ['cool-butterfly-48692871', 'br-nameless-bonus-arditmtp', 'CLEAN_GREY_NOMADS']
];

// System metadata only: no connection URL, credential, role name or user rows.
export async function accountReadiness(sql, sessionConfigured) {
  const rows = await sql`
    SELECT current_setting('neon.project_id',true) AS project_id,
      current_setting('neon.branch_id',true) AS branch_id,
      current_database() = 'neondb' AS database_name_verified,
      (SELECT count(*) = 7 FROM information_schema.columns
       WHERE table_schema='public' AND table_name='users'
       AND column_name IN ('id','public_id','email','password_hash','created_at','updated_at','last_login_at')) AS users_ready,
      EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trips' AND column_name='user_id' AND data_type='bigint') AS trips_ready,
      EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='billing_accounts' AND column_name='user_id' AND data_type='bigint') AS billing_ready,
      COALESCE(
        has_table_privilege(current_user,to_regclass('public.users'),'SELECT') AND
        has_table_privilege(current_user,to_regclass('public.users'),'INSERT') AND
        has_table_privilege(current_user,to_regclass('public.users'),'UPDATE') AND
        has_sequence_privilege(current_user,to_regclass('public.users_id_seq'),'USAGE') AND
        has_table_privilege(current_user,to_regclass('public.trips'),'SELECT') AND
        has_table_privilege(current_user,to_regclass('public.trips'),'INSERT') AND
        has_table_privilege(current_user,to_regclass('public.trips'),'DELETE'), false
      ) AS account_permissions_ready,
      EXISTS(SELECT 1 FROM pg_roles WHERE rolname=current_user AND NOT rolsuper
        AND NOT rolbypassrls AND NOT rolcreaterole AND NOT rolcreatedb)
        AND NOT EXISTS(SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
          WHERE n.nspname='public' AND c.relname IN ('users','trips','billing_accounts')
          AND pg_has_role(current_user,c.relowner,'MEMBER')) AS runtime_role_restricted
  `;
  const row = rows[0] || {};
  const target = targets.find(([project]) => project === row.project_id);
  const branchVerified = Boolean(target && target[1] === row.branch_id && row.database_name_verified === true);
  const schemaReady = row.users_ready === true && row.trips_ready === true && row.billing_ready === true;
  const permissionsReady = row.account_permissions_ready === true;
  return {
    target: target?.[2] || 'UNVERIFIED', branchVerified,
    sessionConfigured: sessionConfigured === true,
    schemaReady, permissionsReady, runtimeRoleRestricted: row.runtime_role_restricted === true,
    accountInfrastructureReady: branchVerified && schemaReady && permissionsReady && sessionConfigured === true,
    scope: 'READ_ONLY_INFRASTRUCTURE_CHECK', authenticatedWorkflowVerified: false
  };
}
