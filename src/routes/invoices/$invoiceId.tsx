import {
  createFileRoute,
  useParams,
}
  from "@tanstack/react-router";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, PaymentIntent } from "@stripe/stripe-js";
import CheckoutForm from "../../components/CheckoutForm";
import SuccessAlert from "../../components/SuccessAlert";
import { Spinner } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import {
  fetchPaymentIntentByInvoice,
  generatePaymentIntent,
} from "../../services/Stripe/paymentIntent";
import { LanguageContext } from "../../contexts/LanguageContext";
import ErrorAlert from "../../components/ErrorAlert";
import { fetchEntriesBy } from "../../services/entries";
import { Entry } from "../../types/types";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const stripePromise = loadStripe(
  "pk_test_51PsnWKBV4uK7jrIfvpQrJ9cWc69diKn2ed2lUQZwQM1AzAu4UuAgj225Q8bPwYpwffxxghxTXyhANhr3lcLqVScr00ajA8mqLK"
);

export const Route = createFileRoute("/invoices/$invoiceId")({
  loader: async ({ params: { invoiceId } }) => {
    const entries: Entry[] = await fetchEntriesBy('NoFacture', invoiceId.toString());
    const debit = entries.find((entry) => entry.Debit !== '0');
    const credit = entries.find((entry) => entry.Credit !== '0');

    return {
      debit,
      credit,
    };
  },
  component: () => <Invoice />,
  errorComponent: ({ error }) => {
    console.error(error);
    return (
      <div className="flex flex-col w-full flex-grow sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto items-start gap-4">
        <ErrorAlert message={"Une erreur s'est produite. / An error occurred."} theme="failure" code={500} />
      </div>
    );
  },
  pendingComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full flex-grow">
        <Spinner
          aria-label="Center-aligned spinner example"
          size={"xl"}
          color={"success"}
        />
      </div>
    );
  },
});

function Invoice() {  
  const { toast } = useToast();

  const { invoiceId } = useParams({
    from: "/invoices/$invoiceId",
  });
  const { debit, credit } = Route.useLoaderData();
  const { lang } = useContext(LanguageContext);

  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!debit || credit) {
      setLoading(false);
      return;
    }

    fetchPaymentIntentByInvoice(debit.NoFacture)
      .then(({ payment_intent: paymentIntent }) => {
        if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "requires_payment_method")) {
          setPaymentIntent(paymentIntent);
          setLoading(false);
          return;
        }
      
        generatePaymentIntent(debit)
          .then(({ payment_intent: paymentIntent}) => {
            setPaymentIntent(paymentIntent);
            setLoading(false);
          })
      })
      .catch((error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: lang === "fr" ? "Une erreur s'est produite" : "Uh oh! Something went wrong.",
          description: lang === "fr" ? "Une erreur s'est produite lors de la création de la tentative de paiement. Veuillez reessayer." : "There was an error generating your payment intent. Please try again.",
          action: <ToastAction altText="Try again" onClick={() => window.location.reload()}>Try again</ToastAction>,
        })
        setLoading(false);
      })
  }, []);

  if (!debit) {
    return (
      <div className="flex flex-col w-full flex-grow sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto items-start gap-4">
        <ErrorAlert message={lang === "fr" ? "Facture " + invoiceId + " introuvable. Veuillez vérifier le numéro de facture et réessayer. Si le problème persiste, veuillez contacter le service client." : "Invoice " + invoiceId + " not found. Please check the invoice number and try again. If the issue persists, please contact the client service."} theme="failure" code={404} />
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full flex-grow sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto items-center justify-center gap-8">
      <div>
        <h1 className="font-extrabold text-slate-800">
          {lang === "fr" ? "Bienvenue sur" : "Welcome to"}
          <br />
          MSM Payments
        </h1>
        <p className="description mt-2 text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
          {lang === "fr"
            ? "Notre système de facturation vous permettant de régler vos factures en ligne en toute sécurité et simplicité."
            : "Our billing system allowing you to pay your invoices online safely and easily."}
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full p-4 lg:p-8 bg-slate-200 rounded-md">
        <div className="flex flex-col gap-1">
          <h5>
            {lang === "fr" ? "Facture " : "Invoice "}
            {debit.NoFacture}
          </h5>
          <p className="description text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl">
            {lang === "fr" ? "Solde: " : "Balance: "}
            {debit.Debit + " $CA"}
          </p>
        </div>
        <div className="flex flex-col w-full">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-40">
              <Spinner
                aria-label="Center-aligned spinner example"
                size={"xl"}
                color={"info"}
              />
            </div>
          ) : credit || paymentIntent && paymentIntent.status === "succeeded" ? (
            <SuccessAlert />
          ) : paymentIntent && paymentIntent.status === "requires_payment_method" ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: paymentIntent.client_secret!,
                locale: lang,
              }}
            >
              <CheckoutForm setPaymentIntent={setPaymentIntent} />
            </Elements>
          ) : (
            <ErrorAlert
              theme="failure"
              message={
                lang === "fr"
                  ? "Une erreur s'est produite lors de la création de la tentative de paiement. Veuillez reessayer."
                  : "There was an error generating your payment intent. Please try again."
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
