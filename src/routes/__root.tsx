import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Language, LanguageProvider } from "../contexts/LanguageContext";
import { useState } from "react";
import { Button } from "flowbite-react";
import { Toaster } from "@/components/ui/toaster";

export const Route = createRootRoute({
  component: App,
});

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get("lang");
  const defaultLang = (langParam ? langParam : "fr") as Language;
  const [lang, setLang] = useState<Language>(defaultLang);

  return (
    <LanguageProvider
      value={{
        lang,
        setLang,
      }}
    >
      <div className="flex flex-col min-h-screen">
        <nav className="flex flex-row justify-between items-center bg-gray-800 text-slate-200 font-bold py-5 px-10">
          <h6 className="text-white">MSM Payments</h6>
          <Button.Group className="">
            <Button
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set("lang", "fr");
                window.history.replaceState({}, "", url.toString());
                setLang("fr")
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white"
              disabled={lang === "fr"}
            >
              FR
            </Button>
            <Button
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set("lang", "en");
                window.history.replaceState({}, "", url.toString());
                setLang("en")
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white"
              disabled={lang === "en"}
            >
              EN
            </Button>
          </Button.Group>
        </nav>
        <main
          className="px-5 py-20 items-center flex flex-col flex-grow"
          style={{
            backgroundColor: "#f9f9f9",
          }}
        >
          <Outlet />
        </main>
        <Toaster />
        <TanStackRouterDevtools />
      </div>
    </LanguageProvider>
  );
}
