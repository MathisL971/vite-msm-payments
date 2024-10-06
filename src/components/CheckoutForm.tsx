import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useContext, useState } from "react";
import { LanguageContext } from "../contexts/LanguageContext";
import { createCreditEntry } from "../services/entries";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import { PaymentIntent } from "@stripe/stripe-js";

type CheckoutFormProps = {
  setPaymentIntent: (paymentIntent: PaymentIntent) => void;
};

const CheckoutForm = (props: CheckoutFormProps) => {
  const { toast } = useToast();
  const { setPaymentIntent } = props;

  const { lang } = useContext(LanguageContext);

  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
  
    if (!stripe || !elements) {
      toast({
        variant: "destructive",
        title: lang === "fr" ? "Une erreur s'est produite" : "Uh oh! Something went wrong.",
        description: lang === "fr" ? "Le paiement a échoué. Veuillez réessayer." : "The payment failed. Please try again.",
        action: <ToastAction altText="Try again" onClick={() => window.location.reload()}>{lang === "fr" ? "Recharger" : "Reload"}</ToastAction>
      })
      setLoading(false);
      return;
    }
  
    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (!result) {
        throw new Error(lang === "fr" ? "Une erreur s'est produite" : "Uh oh! Something went wrong.");
      }
      
      if (result.error) {
        throw new Error(result.error.message);
      }    

      try {
        await createCreditEntry(result.paymentIntent.id);
      } catch (error) {
        console.error(error);
      }
      
      setPaymentIntent(result.paymentIntent);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: lang === "fr" ? "Une erreur s'est produite" : "Uh oh! Something went wrong.",
        description: lang === "fr" ? "Le paiement a échoué. Veuillez réessayer." : "The payment failed. Please try again.",
        action: <ToastAction altText="Try again" onClick={() => window.location.reload()}>{lang === "fr" ? "Recharger" : "Reload"}</ToastAction>
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: "1rem",
      }}
      onSubmit={handleSubmit}
    >
      <PaymentElement />
      <button
        type="submit"
        className={'hover:bg-emerald-400 text-white font-bold py-2 px-4 rounded disabled:bg-emerald-200 disabled:cursor-not-allowed bg-emerald-500'}
        disabled={loading || !stripe}
      >
        {loading
          ? lang === "fr"
            ? "Chargement..."
            : "Loading..."
          : lang === "fr"
            ? "Payer"
            : "Pay"}
      </button>
    </form>
  );
};

export default CheckoutForm;
