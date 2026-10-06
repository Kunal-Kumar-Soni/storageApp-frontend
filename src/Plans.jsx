import { useState } from "react";
import { Link } from "react-router-dom";
import { createSubscription, getSubscription } from "./api/subscription";
import { useEffect } from "react";

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

function PlanCard({ plan, onSelect, isSubscribed }) {
  return (
    <div
      className={classNames(
        "relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition",
        "hover:shadow-md",
        plan.popular ? "border-blue-500/60 ring-1 ring-blue-500/20" : "border-slate-200",
      )}
    >
      {plan.popular && (
        <div className="absolute -top-2 right-4 select-none rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white shadow">
          Most Popular
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
          <p className="text-sm text-slate-500">{plan.tagline}</p>
        </div>
        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
          {plan.storage}
        </span>
      </div>

      <div className="mb-4 flex items-end gap-2">
        <Price value={plan.price} />
        <span className="mb-1.5 text-sm text-slate-500">{plan.period}</span>
      </div>

      <ul className="mb-5 space-y-2 text-sm text-slate-600">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 flex-none"
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
          className={classNames(
            "mt-auto cursor-pointer inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition",
            plan.popular
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-slate-900 text-white hover:bg-slate-800",
          )}
        >
          {plan.cta}
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
  const getSubscriptionData = async () => {
    try {
      const data = await getSubscription();
      setSubscribedPlanIds(data.subscribedPlanIds);
      console.log(data.subscribedPlanIds);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSubscriptionData();
  }, []);

  async function handleSelect(plan) {
    const { subscriptionId } = await createSubscription(plan.id);
    razorpayPopup({ subscriptionId });
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Choose your plan</h1>
        <Link to="/">Home</Link>
      </header>

      {/* Tabs */}
      <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 shadow-sm">
        <button
          onClick={() => setMode("monthly")}
          className={classNames(
            "rounded-lg px-4 py-2 text-sm font-medium border-2 cursor-pointer",
            mode === "monthly" ? "border-blue-500" : "border-white",
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => setMode("yearly")}
          className={classNames(
            "rounded-lg px-4 py-2 text-sm font-medium border-2 cursor-pointer",
            mode === "yearly" ? "border-blue-500" : "border-white",
          )}
        >
          Yearly <span className="ml-1 hidden text-xs text-blue-600 sm:inline">(2 months off)</span>
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={`${mode}-${plan.id}`}
            plan={plan}
            onSelect={handleSelect}
            isSubscribed={subscribedPlanIds.includes(plan.id)}
          />
        ))}
      </div>

      {/* Small helper text */}
      <p className="mt-6 text-xs text-slate-500">
        Prices are indicative for demo. Integrate with Razorpay Subscriptions to start billing. You
        can prefill the plan IDs inside a static config.
      </p>
    </div>
  );
}
