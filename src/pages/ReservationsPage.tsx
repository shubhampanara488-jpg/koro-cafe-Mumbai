import { useMemo, useState, type FormEvent } from 'react';
import { CalendarCheck2, CheckCircle2, Info, MessageCircle, ShieldCheck } from 'lucide-react';
import { buildWhatsAppUrl } from '../components/Footer';
import type { CafeConfig, ReservationEnquiry } from '../types/cafe';

interface ReservationsPageProps {
  config: CafeConfig;
}

const TIME_SLOTS = [
  '08:30 AM – Morning Coffee',
  '10:00 AM – Brunch',
  '12:30 PM – Lunch',
  '03:30 PM – Afternoon Coffee',
  '05:30 PM – Evening Chai & Snacks',
  '07:30 PM – Dinner',
  '09:00 PM – Late Evening',
];

function getTodayIST(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

export function ReservationsPage({ config }: ReservationsPageProps) {
  const minDate = useMemo(() => getTodayIST(), []);

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [date, setDate] = useState(minDate);
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[3]);
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedEnquiry, setConfirmedEnquiry] = useState<ReservationEnquiry | null>(null);
  const [serverNote, setServerNote] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const digits = mobile.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 13) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!date || date < minDate) {
      setErrorMsg('Please select today or an upcoming date. Past dates cannot be booked.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          mobile: mobile.trim(),
          date,
          preferredTime,
          guests,
          specialRequests: specialRequests.trim(),
          website: honeypot,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setErrorMsg(payload.error || 'Could not submit reservation request. Please try again.');
        return;
      }
      setConfirmedEnquiry(payload.enquiry);
      setServerNote(payload.message);
    } catch {
      setErrorMsg('Network error while submitting your request. Please try again or reach us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setConfirmedEnquiry(null);
    setFullName('');
    setMobile('');
    setDate(minDate);
    setGuests(2);
    setSpecialRequests('');
    setErrorMsg(null);
  };

  return (
    <div className="pb-20">
      <section className="py-12 sm:py-16 px-5 sm:px-8 border-b border-[#3B241B]/10">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6B4F]">
            Table Enquiry
          </p>
          <h1 className="font-serif text-[clamp(2.25rem,4vw,3.25rem)] font-semibold text-[#3B241B]">
            Request a Table
          </h1>
          <p className="text-sm sm:text-base text-[#5C4436] leading-relaxed max-w-2xl">
            Planning a quiet work session, coffee catch-up, or family meal at {config.name}? Send
            your preferred time below and our team will confirm availability.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form / Confirmation Column */}
          <div className="lg:col-span-7">
            {confirmedEnquiry ? (
              <div className="bg-[#FFFFFF] rounded-2xl p-7 sm:p-9 border border-[#3B241B]/12 space-y-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-7 h-7 text-[#2E6B40] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#2E6B40]">
                      Enquiry Received · {confirmedEnquiry.referenceCode}
                    </p>
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#3B241B] mt-1">
                      Thank you, {confirmedEnquiry.fullName}
                    </h2>
                  </div>
                </div>

                <p className="text-sm text-[#5C4436] leading-relaxed bg-[#F5EFE6] p-4 rounded-xl border border-[#3B241B]/10">
                  {serverNote}
                </p>

                <dl className="grid grid-cols-2 gap-4 text-sm border-t border-[#3B241B]/10 pt-5">
                  <div>
                    <dt className="text-xs text-[#8A6B4F]">Date</dt>
                    <dd className="font-semibold text-[#3B241B] tabular-nums mt-0.5">
                      {confirmedEnquiry.date}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#8A6B4F]">Guests</dt>
                    <dd className="font-semibold text-[#3B241B] tabular-nums mt-0.5">
                      {confirmedEnquiry.guests} {confirmedEnquiry.guests === 1 ? 'Guest' : 'Guests'}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-[#8A6B4F]">Preferred Time</dt>
                    <dd className="font-semibold text-[#3B241B] mt-0.5">
                      {confirmedEnquiry.preferredTime}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={buildWhatsAppUrl(
                      config.whatsappNumber,
                      `Hi ${config.name}, I submitted table enquiry ${confirmedEnquiry.referenceCode} for ${confirmedEnquiry.guests} guests on ${confirmedEnquiry.date} (${confirmedEnquiry.preferredTime}). Name: ${confirmedEnquiry.fullName}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Follow up on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-[#3B241B] bg-[#F5EFE6] border border-[#3B241B]/15 rounded-lg hover:bg-[#EDE4D7] transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#3B241B]/10 space-y-5"
              >
                {/* Honeypot anti-spam field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-xl bg-[#FDF2F0] border border-[#8C3B2B]/25 text-sm text-[#8C3B2B]"
                  >
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="res-name" className="block text-sm font-semibold text-[#3B241B]">
                    Full Name <span className="text-[#8C3B2B]">*</span>
                  </label>
                  <input
                    id="res-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Ananya Sharma"
                    className="w-full h-11 px-3.5 rounded-lg bg-[#F5EFE6]/50 border border-[#3B241B]/18 text-sm text-[#3B241B] focus:bg-[#FFFFFF] focus:border-[#8A6B4F] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="res-mobile" className="block text-sm font-semibold text-[#3B241B]">
                    Mobile Number <span className="text-[#8C3B2B]">*</span>
                  </label>
                  <input
                    id="res-mobile"
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full h-11 px-3.5 rounded-lg bg-[#F5EFE6]/50 border border-[#3B241B]/18 text-sm text-[#3B241B] tabular-nums focus:bg-[#FFFFFF] focus:border-[#8A6B4F] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="res-date" className="block text-sm font-semibold text-[#3B241B]">
                      Date <span className="text-[#8C3B2B]">*</span>
                    </label>
                    <input
                      id="res-date"
                      type="date"
                      required
                      min={minDate}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg bg-[#F5EFE6]/50 border border-[#3B241B]/18 text-sm text-[#3B241B] tabular-nums focus:bg-[#FFFFFF] focus:border-[#8A6B4F] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="res-guests" className="block text-sm font-semibold text-[#3B241B]">
                      Number of Guests <span className="text-[#8C3B2B]">*</span>
                    </label>
                    <select
                      id="res-guests"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full h-11 px-3.5 rounded-lg bg-[#F5EFE6]/50 border border-[#3B241B]/18 text-sm text-[#3B241B] focus:bg-[#FFFFFF] focus:border-[#8A6B4F] focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((count) => (
                        <option key={count} value={count}>
                          {count} {count === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="res-time" className="block text-sm font-semibold text-[#3B241B]">
                    Preferred Time <span className="text-[#8C3B2B]">*</span>
                  </label>
                  <select
                    id="res-time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg bg-[#F5EFE6]/50 border border-[#3B241B]/18 text-sm text-[#3B241B] focus:bg-[#FFFFFF] focus:border-[#8A6B4F] focus:outline-none"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="res-notes" className="block text-sm font-semibold text-[#3B241B]">
                    Special Requests <span className="text-xs font-normal text-[#8A6B4F]">(Optional)</span>
                  </label>
                  <textarea
                    id="res-notes"
                    rows={3}
                    maxLength={400}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Window seat near power outlet, birthday pastry note, high chair..."
                    className="w-full p-3.5 rounded-lg bg-[#F5EFE6]/50 border border-[#3B241B]/18 text-sm text-[#3B241B] focus:bg-[#FFFFFF] focus:border-[#8A6B4F] focus:outline-none"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5EFE6] border border-[#3B241B]/10 flex items-start gap-2.5 text-xs text-[#5C4436] leading-relaxed">
                  <Info className="w-4 h-4 text-[#8A6B4F] shrink-0 mt-0.5" />
                  <p>
                    Submitting this form records a table reservation enquiry and{' '}
                    <strong className="text-[#3B241B]">
                      does not guarantee a confirmed booking
                    </strong>{' '}
                    until our team checks table availability and confirms with you.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 px-6 text-sm font-semibold text-[#F5EFE6] bg-[#3B241B] rounded-lg hover:bg-[#4F3226] disabled:opacity-60 transition-colors"
                >
                  {submitting ? 'Submitting Enquiry...' : 'Submit Reservation Enquiry'}
                </button>
              </form>
            )}
          </div>

          {/* Rules & Privacy Sidebar */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#3B241B]/10 space-y-4">
              <div className="flex items-center gap-2.5 text-[#3B241B]">
                <CalendarCheck2 className="w-5 h-5 text-[#8A6B4F]" />
                <h2 className="font-serif text-xl font-semibold">Reservation Notes</h2>
              </div>
              <ul className="space-y-3 text-sm text-[#5C4436] leading-relaxed">
                <li>Walk-ins are always welcome throughout the day for coffee and quick bites.</li>
                <li>We hold confirmed tables for up to 15 minutes past the agreed time slot.</li>
                <li>
                  For groups larger than 8 guests or immediate same-day seating, reaching out on
                  WhatsApp is fastest.
                </li>
              </ul>
              <div className="pt-2">
                <a
                  href={buildWhatsAppUrl(
                    config.whatsappNumber,
                    `Hi ${config.name}, I'd like to check table availability.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#3B241B] hover:text-[#8A6B4F] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message us directly on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="bg-[#EDE4D7]/70 rounded-2xl p-6 border border-[#3B241B]/10 space-y-2.5">
              <div className="flex items-center gap-2 text-[#3B241B]">
                <ShieldCheck className="w-4 h-4 text-[#8A6B4F]" />
                <h3 className="font-serif text-base font-semibold">Privacy Notice</h3>
              </div>
              <p className="text-xs text-[#5C4436] leading-relaxed">
                We collect only your name, mobile number, and visit timing to coordinate your table
                enquiry. Your contact information is never sold or shared for third-party marketing.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
