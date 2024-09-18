import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useContext, useState } from "react";
import { Entry } from "../types/types";
import { LanguageContext } from "../contexts/LanguageContext";
import { createEntry } from "../services/entries";

type CheckoutFormProps = {
  debit: Entry;
  setCredit: (credit: Entry) => void;
};

const CheckoutForm = (props: CheckoutFormProps) => {
  const { debit, setCredit } = props;

  const { lang } = useContext(LanguageContext);

  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      const creditData = {
        IDFFactureDB: debit.IDFFactureDB,
        NoFacture: debit.NoFacture,
        Credit: debit.Debit.split(',').join('.'),
        Debit: '0',
        Nature: 3,
        Reference: 'CH.#XXXX',
        IDFModePaiementDB: 2,
        ModePaiementDB: 2,
        Titre: 'Credit card',
        IDFCompte: 1,
        IDFClient: 1,
        Code_Client: debit.Code_Client,
        Nom_Client: debit.Nom_Client,         
        // DATE: '2024/09/18,
        // Photo: '',
      }

      const results: Entry[] = await createEntry(creditData);

      if (!results || results.length === 0) {
        throw new Error('Error when inserting the entry');
      }

      setCredit(results[0]);
    }
    setLoading(false);
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
