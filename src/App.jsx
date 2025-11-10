import { useEffect, useMemo, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { Check, Zap, Sparkles, Bot, Shield, Settings } from 'lucide-react'

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb' // Sandbox by default

export default function App() {
  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly' | 'annual'
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [addons, setAddons] = useState({ concierge: true, priority: false, analytics: false })
  const paypalRef = useRef(null)
  const paypalLoaded = useRef(false)

  // Pricing model
  const plans = {
    starter: {
      name: 'Starter',
      blurb: 'Launch your first AI agent',
      monthly: 19,
      annual: 190,
      features: ['1 production agent', '2,000 requests/mo', 'Community support'],
      highlight: false,
    },
    pro: {
      name: 'Pro',
      blurb: 'Scale with multi-agent teams',
      monthly: 49,
      annual: 490,
      features: ['Up to 5 agents', '25,000 requests/mo', 'Priority routing', 'Fine-tuned skills'],
      highlight: true,
    },
    enterprise: {
      name: 'Enterprise',
      blurb: 'Custom AI operating system',
      monthly: 149,
      annual: 1490,
      features: ['Unlimited agents', 'SLA + SSO', 'Dedicated cluster', 'Onboarding & training'],
      highlight: false,
    },
  }

  const addonCatalog = {
    concierge: {
      label: 'Concierge setup',
      desc: 'White-glove agent design session',
      monthly: 49,
      annual: 490,
    },
    priority: {
      label: 'Priority support',
      desc: '24/7 chat with human-in-the-loop',
      monthly: 29,
      annual: 290,
    },
    analytics: {
      label: 'Deep analytics',
      desc: 'Journey tracing and guardrails',
      monthly: 19,
      annual: 190,
    },
  }

  const total = useMemo(() => {
    const planPrice = plans[selectedPlan][billingCycle]
    const addonsTotal = Object.entries(addons).reduce((sum, [key, on]) => {
      if (!on) return sum
      return sum + addonCatalog[key][billingCycle]
    }, 0)
    return planPrice + addonsTotal
  }, [selectedPlan, billingCycle, addons])

  // Load PayPal SDK dynamically once
  useEffect(() => {
    if (paypalLoaded.current) return
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture` 
    script.async = true
    script.onload = () => {
      paypalLoaded.current = true
      renderPaypalButtons()
    }
    document.body.appendChild(script)
    // eslint-disable-next-line
  }, [])

  // Re-render PayPal buttons when total changes
  useEffect(() => {
    renderPaypalButtons()
    // eslint-disable-next-line
  }, [total])

  const renderPaypalButtons = () => {
    if (!window.paypal || !paypalRef.current) return
    paypalRef.current.innerHTML = ''
    window.paypal
      .Buttons({
        style: { layout: 'horizontal', color: 'silver', shape: 'pill', label: 'paypal' },
        createOrder: (_, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total.toFixed(2),
                },
                description: `${plans[selectedPlan].name} · ${billingCycle} billing` ,
              },
            ],
          })
        },
        onApprove: async (_, actions) => {
          try {
            const details = await actions.order.capture()
            alert(`Payment successful! Transaction: ${details.id}`)
          } catch (e) {
            alert('Payment capture failed. Please try again.')
          }
        },
        onError: () => alert('There was an error with PayPal. Please try again.'),
      })
      .render(paypalRef.current)
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-white relative overflow-x-hidden">
      {/* Hero with Spline */}
      <div className="relative h-[88vh] md:h-[92vh] w-full">
        {/* Spline 3D scene */}
        <div className="absolute inset-0">
          <Spline 
            scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" 
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Soft gradient overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/30 via-[#0a0a0f]/60 to-[#0a0a0f]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0f]" />

        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-gradient-to-tr from-purple-500 via-blue-500 to-orange-400 shadow-inner flex items-center justify-center">
                <Bot className="text-white" size={20} />
              </div>
              <span className="text-white/90 text-lg font-semibold tracking-tight">Aion Labs</span>
              <span className="hidden sm:inline-flex text-xs text-white/70 bg-white/10 px-2 py-0.5 rounded-full items-center gap-1">
                <Sparkles size={14} /> AI Agent Studio
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-white/70">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#pricing" className="hover:text-white transition">Pricing</a>
              <a href="#contact" className="hover:text-white transition">Contact</a>
            </div>
            <a href="#pricing" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition rounded-full px-4 py-2 text-sm">
              <Zap size={16} className="text-amber-300" /> Get started
            </a>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 h-full flex items-center">
          <div className="mx-auto max-w-7xl px-6 w-full grid md:grid-cols-12 gap-8">
            <div className="md:col-span-7">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                Build and deploy AI agents that actually ship work
              </h1>
              <p className="mt-5 text-lg text-white/70 max-w-2xl">
                We design autonomous agent systems for support, growth, and ops. Orchestrate tools, guardrails, and human-in-the-loop inside a single AI operating layer.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#pricing" className="px-5 py-3 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-orange-400 font-semibold shadow-lg shadow-purple-500/20">
                  See plans
                </a>
                <a href="#features" className="px-5 py-3 rounded-full border border-white/15 hover:bg-white/5 transition">
                  How it works
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-white/60">
                <div className="flex items-center gap-2"><Shield size={16} className="text-emerald-300"/> SOC2-ready</div>
                <div className="flex items-center gap-2"><Settings size={16} className="text-sky-300"/> Toolchain orchestration</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="relative py-20 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Voice + Chat Agents',
                desc: 'Natural conversations powered by retrieval and memory.',
              },
              {
                title: 'Workflow Automation',
                desc: 'Agents that book, summarize, file tickets, and close loops.',
              },
              {
                title: 'Safety & Guardrails',
                desc: 'Policy checks, red teaming, and human approvals where needed.',
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-white/70">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Simple, transparent pricing</h2>
              <p className="text-white/70 mt-2">Choose a plan and tailor it with add‑ons. Pay monthly or annually.</p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-2 py-1">
              <span className={`text-sm px-3 py-1 rounded-full ${billingCycle==='monthly' ? 'bg-white/10' : ''}`}>Monthly</span>
              <button
                className="relative inline-flex h-8 w-14 items-center rounded-full bg-white/10"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                aria-label="Toggle billing"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition translate-x-1 ${billingCycle==='annual' ? 'translate-x-7' : ''}`}
                />
              </button>
              <span className={`text-sm px-3 py-1 rounded-full ${billingCycle==='annual' ? 'bg-white/10' : ''}`}>Annual <span className="text-emerald-300">(Save ~2 months)</span></span>
            </div>
          </div>

          <div className="mt-10 grid lg:grid-cols-3 gap-6">
            {Object.entries(plans).map(([key, plan]) => (
              <label key={key} className={`relative rounded-2xl border p-6 cursor-pointer block ${
                selectedPlan===key ? 'border-purple-400/60 bg-gradient-to-b from-white/10 to-white/5' : 'border-white/10 bg-white/5'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/60">{plan.blurb}</div>
                    <div className="mt-1 text-2xl font-bold">{plan.name}</div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold">
                        ${plan[billingCycle]}
                      </span>
                      <span className="text-white/60">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="plan"
                    checked={selectedPlan===key}
                    onChange={() => setSelectedPlan(key)}
                    className="mt-1 h-5 w-5 accent-purple-400"
                  />
                </div>
                <ul className="mt-5 space-y-2 text-sm">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-white/80">
                      <Check size={16} className="text-emerald-300"/> {feat}
                    </li>
                  ))}
                </ul>
                {plan.highlight && (
                  <div className="absolute -top-2 right-4 text-xs bg-gradient-to-r from-purple-500 to-blue-500 px-2 py-0.5 rounded-full">Popular</div>
                )}
              </label>
            ))}
          </div>

          <div className="mt-10 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold">Add‑ons</h3>
              <div className="mt-4 grid md:grid-cols-3 gap-4">
                {Object.entries(addonCatalog).map(([key, a]) => (
                  <label key={key} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addons[key]}
                      onChange={(e) => setAddons((s) => ({ ...s, [key]: e.target.checked }))}
                      className="mt-1 h-5 w-5 accent-purple-400"
                    />
                    <div>
                      <div className="font-medium">{a.label}</div>
                      <div className="text-white/70 text-sm">{a.desc}</div>
                      <div className="mt-2 text-sm text-white/80">+ ${a[billingCycle]} / {billingCycle === 'monthly' ? 'mo' : 'yr'}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-fit">
              <h3 className="text-lg font-semibold">Checkout</h3>
              <div className="mt-4 space-y-2 text-sm text-white/70">
                <div className="flex justify-between"><span>Plan</span><span>{plans[selectedPlan].name}</span></div>
                <div className="flex justify-between"><span>Billing</span><span className="capitalize">{billingCycle}</span></div>
                <div className="flex justify-between font-semibold text-white"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              <div className="mt-4 text-xs text-white/60">Payments are processed securely via PayPal.</div>
              <div ref={paypalRef} className="mt-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/60 text-sm">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-gradient-to-tr from-purple-500 via-blue-500 to-orange-400" />
            <span>Aion Labs — AI Agent Agency</span>
          </div>
          <div className="flex items-center gap-6">
            <a className="hover:text-white" href="#">Privacy</a>
            <a className="hover:text-white" href="#">Terms</a>
            <a className="hover:text-white" href="mailto:hello@aionlabs.ai">hello@aionlabs.ai</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
