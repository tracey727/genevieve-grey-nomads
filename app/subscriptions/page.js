import Link from 'next/link';
import Shell from '../../components/Shell';
import styles from '../legal/legal.module.css';

export const metadata = { title: 'Subscription & Refund Policy | GENEVIEVE — The Budget Travels' };

export default function SubscriptionPolicyPage() {
  return (
    <Shell current="My Trip">
      <article className={`panel ${styles.card}`}>
        <p className="eyebrow">GENEVIEVE — The Budget Travels</p><h2>Subscription & Refund Policy</h2>
        <p className={styles.meta}>Last updated: 19 August 2026</p>

        <h3>1. Clear recurring price before purchase</h3>
        <p>Before a subscription can be purchased, GENEVIEVE will display the recurring price in Australian dollars, the billing period, and that the subscription renews automatically until cancelled. The total price payable must be clear before you commit to payment. We do not use hidden pre-selected paid extras.</p>

        <h3>2. How payment works</h3>
        <p>Subscription checkout is hosted by Stripe. GENEVIEVE does not store your full card number in its application database. Stripe may create a customer and subscription record and provide GENEVIEVE with identifiers, payment status, billing email and subscription information needed to provide membership.</p>

        <h3>3. Automatic renewal</h3>
        <p>Your subscription renews at the billing interval shown at checkout until you cancel it. We do not treat a one-off payment as permission to start a different undisclosed recurring charge.</p>

        <h3>4. Cancelling</h3>
        <p>You can open <Link href="/billing">Membership</Link> and use the Stripe Customer Portal to manage or cancel your subscription. There is no cancellation fee. Unless a different remedy is required by law, cancellation normally stops renewal and access continues until the end of the period you have already paid for.</p>

        <h3>5. Price changes</h3>
        <p>A price increase will not be applied retrospectively to a period already paid for. If a future renewal price changes, we will provide reasonable notice before the new price takes effect so that you can decide whether to continue or cancel.</p>

        <h3>6. Failed payments</h3>
        <p>Stripe may retry a failed recurring payment and may ask you to update your payment method. A failed payment may affect paid membership features after applicable recovery steps, but it must not block Emergency or core Safety access.</p>

        <h3>7. Refunds and Australian Consumer Law</h3>
        <p>We do not use a blanket “no refunds” rule. Your rights under the Australian Consumer Law cannot be excluded. If a service has a major failure or otherwise does not meet a non-excludable consumer guarantee, you may be entitled to cancel and receive a refund for an unused portion, compensation for reduced value, or another remedy depending on the circumstances.</p>
        <p>For a change-of-mind cancellation where the service has been supplied as promised, an automatic pro-rata refund is not promised unless required by law or expressly stated at the time of purchase. You may still contact us and we can consider the circumstances.</p>

        <h3>8. Taxes and receipts</h3>
        <p>Any tax or unavoidable charge that must be included in the consumer price will be reflected in the total price presented before purchase. Stripe provides payment records and receipts as part of the payment flow.</p>

        <h3>9. Contact about billing</h3>
        <p>Email <a href="mailto:tracey@genevieveapp.com.au">tracey@genevieveapp.com.au</a>. Please include enough information for us to identify the subscription, but do not send full card numbers or security codes by email.</p>
      </article>
    </Shell>
  );
}
