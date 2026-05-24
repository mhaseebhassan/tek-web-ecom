'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import PageShell from '@/components/PageShell';
import ScrollReveal from '@/components/ui/ScrollReveal';

const infoItems = [
  {
    icon: MapPinIcon,
    title: 'Address',
    lines: ['123 Tech Street', 'Digital City, DC 12345', 'Pakistan'],
  },
  {
    icon: PhoneIcon,
    title: 'Phone',
    lines: ['(555) 123-4567'],
  },
  {
    icon: EnvelopeIcon,
    title: 'Email',
    lines: ['support@tekron.com'],
  },
  {
    icon: ClockIcon,
    title: 'Business hours',
    lines: ['Mon-Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM', 'Sun: Closed'],
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/contact', formData);
      toast.success('Message received. Our team will respond shortly.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(error.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <PageShell
      title="Contact us"
      subtitle="Questions about an order, a product, or your account? Send a note and we will get back to you."
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <ScrollReveal>
          <div className="grid gap-4">
            {infoItems.map(({ icon: Icon, title, lines }, index) => (
              <div key={title} className="surface-card group relative overflow-hidden p-6 transition-smooth hover:-translate-y-1 hover:border-primary/25" style={{ animationDelay: `${index * 60}ms` }}>
                <div className="aurora-sheen opacity-0 transition-opacity duration-700 group-hover:opacity-45" />
                <div className="relative z-10 flex gap-5">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[1.2rem] bg-primary text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-foreground">{title}</h3>
                    {lines.map((line) => (
                      <p key={line} className="mt-1 text-sm font-medium text-muted-foreground">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <form onSubmit={handleSubmit} className="surface-panel relative overflow-hidden p-8 md:p-10">
            <div className="aurora-sheen opacity-[0.35]" />
            <div className="relative z-10 space-y-6">
              <div>
                <span className="label label-primary">Support</span>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-foreground">Send a message</h2>
              </div>
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-bold text-foreground">
                  Name
                </label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required minLength={2} className="input-field" />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-foreground">
                  Email
                </label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-bold text-foreground">
                  Message
                </label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required minLength={10} rows={5} className="input-field min-h-[160px] resize-y" />
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? 'Sending' : 'Send message'}
              </button>
            </div>
          </form>
        </ScrollReveal>
      </div>
    </PageShell>
  );
}
