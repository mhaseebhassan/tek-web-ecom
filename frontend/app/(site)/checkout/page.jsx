'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheckIcon, LockClosedIcon, CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import SectionDivider from '@/components/SectionDivider';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Confetti from '@/components/Confetti';

export default function CheckoutPage() {
    const { cart, total, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        cardNumber: '',
        expDate: '',
        cvc: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        setIsProcessing(true);

        try {
            const { default: api } = await import('@/lib/api');
            const response = await api.post('/orders', {
                email: formData.email,
                name: `${formData.firstName} ${formData.lastName}`.trim() || 'Guest',
                items: cart.map((item) => ({
                    product: item.id,
                    quantity: item.quantity,
                })),
                shippingAddress: {
                    street: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.postalCode,
                    country: formData.country,
                },
                paymentMethod: 'Credit Card',
            });

            setSuccess(true);
            clearCart();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Unable to place order');
        } finally {
            setIsProcessing(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 relative overflow-hidden bg-gray-50/50">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-100/40 to-teal-100/40 rounded-full blur-3xl -z-10"></div>
                <div className="glass-card p-12 rounded-[2.5rem] shadow-2xl shadow-emerald-500/10 text-center max-w-lg w-full">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-emerald-50">
                        <CheckCircleIcon className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Payment Successful</h1>
                    <p className="text-gray-500 mb-8 text-lg">Thank you for your order! Your premium gear is on its way.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="btn-primary w-full px-8 py-4 text-sm font-bold group"
                    >
                        Return to Store
                    </button>
                </div>
            </div>
        );
    }

    if (cart.length === 0 && !success) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link href="/products" className="text-teal-600 hover:underline">Return to shopping</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-16 relative overflow-hidden theme-sunset">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-cyan-100/50 to-teal-100/30 rounded-full blur-3xl opacity-50 pointer-events-none -z-10 -translate-y-1/4 translate-x-1/4"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 reveal">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-10">
                    Checkout
                </h1>
                <SectionDivider variant="sunset" />

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                    {/* Form Section */}
                    <div className="w-full lg:w-3/5">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {error && (
                                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">
                                    {error}
                                </div>
                            )}

                            {/* Shipping Information */}
                            <div className="glass-panel p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-teal-500/10">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">1</div>
                                    Shipping Details
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                        <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow hover:shadow-sm" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                        <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow hover:shadow-sm" placeholder="Doe" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow hover:shadow-sm" placeholder="john@example.com" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                                        <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow hover:shadow-sm" placeholder="123 Apple Park Way" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                        <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow hover:shadow-sm" placeholder="Cupertino" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                                        <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow hover:shadow-sm" placeholder="CA" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
                                        <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow hover:shadow-sm" placeholder="95014" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                                        <input required type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow hover:shadow-sm" placeholder="United States" />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="glass-panel p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-teal-500/10">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">2</div>
                                    Payment Method
                                </h2>

                                <div className="p-4 mb-6 rounded-2xl border-2 border-teal-500 bg-teal-50/30 flex items-center gap-4 cursor-pointer">
                                    <div className="w-5 h-5 rounded-full border-4 border-teal-600"></div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">Credit Card</p>
                                        <p className="text-sm text-gray-500">Safe money transfer using your bank account</p>
                                    </div>
                                    <CreditCardIcon className="w-8 h-8 text-teal-600" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                                        <div className="relative">
                                            <input required type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} maxLength="19" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow hover:shadow-sm font-mono tracking-widest text-lg placeholder:tracking-normal placeholder:font-sans" placeholder="0000 0000 0000 0000" />
                                            <CreditCardIcon className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Expiration Date</label>
                                        <input required type="text" name="expDate" value={formData.expDate} onChange={handleInputChange} maxLength="5" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow hover:shadow-sm" placeholder="MM/YY" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">CVC</label>
                                        <input required type="text" name="cvc" value={formData.cvc} onChange={handleInputChange} maxLength="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow hover:shadow-sm" placeholder="123" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="btn-primary w-full sm:w-auto px-10 py-4 text-lg font-bold disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing Payment...
                                        </>
                                    ) : (
                                        <>
                                            <LockClosedIcon className="w-5 h-5" />
                                            Pay ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-2/5">
                        <div className="glass-card p-8 rounded-[2.5rem] shadow-2xl shadow-teal-500/10 sticky top-28">
                            <h2 className="text-2xl font-black text-gray-900 mb-6">In Your Cart</h2>

                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-100 items-center">
                                        <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-2">
                                            <Image src={item.image} alt={item.name} width={50} height={50} className="object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                                            <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-gray-900">${(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-gray-100 text-gray-600 mb-6">
                                <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl">
                                    <span className="font-medium text-sm">Subtotal</span>
                                    <span className="font-bold text-gray-900">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center bg-emerald-50/50 p-3 rounded-xl text-emerald-700">
                                    <span className="font-medium text-sm">Shipping</span>
                                    <span className="font-bold text-xs px-2 py-1 bg-emerald-100 rounded-md">FREE</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200/60 pt-6">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-lg font-medium text-gray-600">Total</span>
                                    <span className="text-3xl font-black text-gray-900">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-teal-50 text-teal-700 rounded-2xl mt-4">
                                <ShieldCheckIcon className="w-6 h-6 flex-shrink-0" />
                                <p className="text-xs font-medium">All payments are secure and encrypted. Tekron guarantees safe data transmission.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
