/* global Razorpay */
import { useState } from "react";
import { Link } from "react-router-dom";
import { createSubscription, getSubscription } from "./api/subscription";
import { useEffect } from "react";
import LoadingIndicator from "./components/LoadingIndicator";
import BrandMark from "./components/BrandMark";

const PLAN_CATALOG = {
  monthly: [
    {
      id: "plan_TezFOTuBXRSszs",
      name: "Starter",
      tagline: "Great for individuals",
      storage: "2 TB",
      price: 199,
      period: "/mo",
      cta: "Choose 2 TB",
      features: ["Secure cloud storage", "Link & folder sharing", "Basic support"],
      popular: false,
    },
    {
      id: "plan_TezIEf0LoEdsWx",
      name: "Pro",
      tagline: "For creators & devs",
      storage: "5 TB",
      price: 399,
      period: "/mo",
      cta: "Choose 5 TB",
      features: ["Everything in Starter", "Priority uploads", "Email support"],
      popular: true,
    },
    {
      id: "plan_TezLgBhYeFr1Tj",
      name: "Ultimate",
      tagline: "Teams & power users",
      storage: "10 TB",
      price: 699,
      period: "/mo",
      cta: "Choose 10 TB",
      features: ["Everything in Pro", "Version history", "Priority support"],
      popular: false,
    },
  ],
  yearly: [
    {
      id: "plan_TezGc86qpAviFU",
      name: "Starter",
      tagline: "Great for individuals",
      storage: "2 TB",
      price: 1999,
      period: "/yr",
      cta: "Choose 2 TB",
      features: ["Secure cloud storage", "Link & folder sharing", "Basic support"],
      popular: false,
    },
    {
      id: "plan_TezK4Wc6EwJrT6",
      name: "Pro",
      tagline: "For creators & devs",
      storage: "5 TB",
      price: 3999,
      period: "/yr",
      cta: "Choose 5 TB",
      features: ["Everything in Starter", "Priority uploads", "Email support"],
      popular: true,
    },
    {
      id: "plan_TezNVbbASNC2kt",
      name: "Ultimate",
      tagline: "Teams & power users",
      storage: "10 TB",
      price: 6999,
      period: "/yr",
      cta: "Choose 10 TB",
      features: ["Everything in Pro", "Version history", "Priority support"],
      popular: false,
    },
  ],
};

function classNames(...cls) {
  return cls.filter(Boolean).join(" ");
}

function Price({ value }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-semibold text-slate-700">₹</span>
      <span className="text-4xl font-bold tracking-tight text-slate-900">{value}</span>
    </div>
  );
}

function PlanCard({ plan, onSelect, isSubscribed, isSelecting }) {
  return (
    <div
      className={classNames(
        "relative flex flex-col overflow-hidden rounded-3xl border bg-white p-6 shadow-lg shadow-slate-200/60 transition duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        plan.popular
          ? "border-blue-500 bg-linear-to-b from-blue-50 to-white ring-4 ring-blue-100"
          : "border-slate-200",
      )}
    >
      {plan.popular && (
        <div className="absolute right-5 top-5 select-none rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-blue-600/25">
          Most Popular
        </div>
      )}

      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-blue-600">Storage plan</p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">{plan.name}</h3>
          <p className="text-sm text-slate-500">{plan.tagline}</p>
        </div>
        <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">
          {plan.storage}
        </span>
      </div>

      <div className="mb-5 flex items-end gap-2 border-y border-slate-100 py-5">
        <Price value={plan.price} />
        <span className="mb-1.5 text-sm text-slate-500">{plan.period}</span>
      </div>

      <p className="mb-3 text-xs font-bold uppercase tracking-[.12em] text-slate-400">
        What&apos;s included
      </p>
      <ul className="mb-6 space-y-3 text-sm text-slate-600">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 flex-none text-emerald-500"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {isSubscribed ? (
        <button
          disabled
          className="mt-auto inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200"
        >
          ✓ Already Subscribed
        </button>
      ) : (
        <button
          onClick={() => onSelect?.(plan)}
          disabled={isSelecting}
          className={classNames(
            "mt-auto cursor-pointer inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition",
            plan.popular
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-900 text-white hover:bg-slate-800",
            isSelecting && "cursor-wait opacity-70",
          )}
        >
          {isSelecting ? "Opening checkout…" : plan.cta}
        </button>
      )}
    </div>
  );
}

function razorpayPopup({ subscriptionId }) {
  const rzp = new Razorpay({
    key: import.meta.env.VITE_RAZORPAY_KEY,
    name: "Kunal Kumar",
    subscription_id: subscriptionId,
    currency: "INR",
    handler: async (response) => {
      console.log(response);
    },
  });
  rzp.on("payment.failed", (res) => {
    console.log(res);
  });
  rzp.open();
}

export default function Plans() {
  const [mode, setMode] = useState("monthly");
  const plans = PLAN_CATALOG[mode];

  const [subscribedPlanIds, setSubscribedPlanIds] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [selectingPlanId, setSelectingPlanId] = useState(null);
  const getSubscriptionData = async () => {
    try {
      const data = await getSubscription();
      setSubscribedPlanIds(data.subscribedPlanIds);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingPlans(false);
    }
  };
  useEffect(() => {
    getSubscriptionData();
  }, []);

  async function handleSelect(plan) {
    try {
      setSelectingPlanId(plan.id);
      const { subscriptionId } = await createSubscription(plan.id);
      razorpayPopup({ subscriptionId });
    } finally {
      setSelectingPlanId(null);
    }
  }

  useEffect(() => {
    const razorpayScript = document.querySelector("#rzp-script");
    if (razorpayScript) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.id = "rzp-script";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dbeafe,transparent_36%),#f8fafc] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-5 py-4 shadow-lg shadow-blue-950/5 backdrop-blur">
          <div className="flex items-center gap-3">
            <BrandMark className="h-10 w-10" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">
                Storage that grows with you
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Choose your plan
              </h1>
            </div>
          </div>
          <Link
            to="/"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Home
          </Link>
        </header>

        {/* Tabs */}
        <div className="mx-auto mb-5 max-w-xl text-center">
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-[.14em] text-blue-700">
            Flexible storage
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Space that grows with your ideas.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Choose a simple plan today. Switch whenever your storage needs change.
          </p>
        </div>
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-200/60">
            <button
              onClick={() => setMode("monthly")}
              className={classNames(
                "rounded-lg px-4 py-2 text-sm font-semibold transition cursor-pointer",
                mode === "monthly"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setMode("yearly")}
              className={classNames(
                "rounded-lg px-4 py-2 text-sm font-semibold transition cursor-pointer",
                mode === "yearly"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              Yearly{" "}
              <span className="ml-1 hidden text-xs text-blue-600 sm:inline">(2 months off)</span>
            </button>
          </div>
        </div>

        {/* Cards grid */}
        {isLoadingPlans ? (
          <LoadingIndicator label="Checking your subscription…" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard
                key={`${mode}-${plan.id}`}
                plan={plan}
                onSelect={handleSelect}
                isSubscribed={subscribedPlanIds.includes(plan.id)}
                isSelecting={selectingPlanId === plan.id}
              />
            ))}
          </div>
        )}

        {/* Small helper text */}
        <p className="mt-8 text-center text-xs text-slate-500">
          Prices are indicative for demo. Integrate with Razorpay Subscriptions to start billing.
          You can prefill the plan IDs inside a static config.
        </p>
      </div>
    </div>
  );
}
