import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/component/ui/card';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import { Textarea } from '@/component/ui/textarea';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/component/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Clock, Send, User } from 'lucide-react';

// const teamMembers = [
//     {
//         name: 'Sarah Johnson',
//         role: 'Founder & CEO',
//         image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
//         email: 'sarah@minimaxmall.com'
//     },
//     {
//         name: 'Michael Chen',
//         role: 'Head of Design',
//         image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
//         email: 'michael@minimaxmall.com'
//     },
//     {
//         name: 'Emily Rodriguez',
//         role: 'Customer Success Manager',
//         image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
//         email: 'emily@minimaxmall.com'
//     },
//     {
//         name: 'David Thompson',
//         role: 'Operations Director',
//         image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
//         email: 'david@minimaxmall.com'
//     }
// ];
//
// const faqs = [
//     {
//         question: 'What are your shipping options?',
//         answer: 'We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free shipping is available on orders over $50.'
//     },
//     {
//         question: 'What is your return policy?',
//         answer: 'We accept returns within 30 days of purchase. Items must be unused and in original packaging. Return shipping costs may apply unless the item is defective.'
//     },
//     {
//         question: 'Do you offer custom tailoring services?',
//         answer: 'Yes! We offer professional tailoring services for custom-fitted clothing. Visit our Booking page to schedule an appointment with our expert tailors.'
//     },
//     {
//         question: 'How can I track my order?',
//         answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also check your order status in your profile under "Orders".'
//     },
//     {
//         question: 'What payment methods do you accept?',
//         answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay for your convenience.'
//     },
//     {
//         question: 'Do you have a physical store?',
//         answer: 'Yes, we have a showroom at our headquarters. Visit us at 123 Fashion Street, New York, NY 10001. We recommend booking an appointment for personalized service.'
//     },
//     {
//         question: 'How do I care for my tailored garments?',
//         answer: 'Each garment comes with specific care instructions. Generally, we recommend dry cleaning for tailored pieces. Avoid machine washing unless specified on the care label.'
//     },
//     {
//         question: 'Can I cancel or modify my order?',
//         answer: 'Orders can be cancelled or modified within 2 hours of placement. After that, the order is processed and cannot be changed. Contact us immediately if you need assistance.'
//     }
// ];

export function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: 'Message Sent!',
            description: 'We\'ll get back to you within 24 hours.',
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Let's Connect</h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
                        Have a question about our tailored clothing or services? We'd love to hear from you. 
                        Our team is here to provide you with exceptional support.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
                                    <MapPin className="h-8 w-8 text-primary-foreground" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Visit Us</h3>
                                <p className="text-sm text-muted-foreground">
                                    Adenta Housing<br />
                                    Christ Apostolic Church
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                                    <Phone className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Call Us</h3>
                                <p className="text-sm text-muted-foreground">
                                    0544701851<br />
                                    0248167891
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                                    <Mail className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Email Us</h3>
                                <p className="text-sm text-muted-foreground">
                                    Threadzbigaskins@gmail.com<br />
                                    support@threadzbigskins.com
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                                    <Clock className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Business Hours</h3>
                                <p className="text-sm text-muted-foreground">
                                    Mon-Fri: 9AM-7PM<br />
                                    Sat: 10AM-5PM
                                    Sun: By Appointment
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                    {/* Contact Form */}
                    <Card className="shadow-xl">
                        <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent pb-8">
                            <CardTitle className="text-2xl">Send us a Message</CardTitle>
                            <CardDescription className="text-base">
                                Fill out the form below and we'll get back to you shortly
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name *</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="pl-9"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pl-9"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject *</Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        placeholder="How can we help?"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message *</Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Tell us more about your inquiry..."
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Location Map */}
                    <Card className="shadow-xl">
                        <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent pb-8">
                            <CardTitle className="text-2xl">Our Location</CardTitle>
                            <CardDescription className="text-base">Visit our showroom and design studio</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video rounded-lg overflow-hidden bg-muted mb-4">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9476519598093!2d-73.99185268459253!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Address</p>
                                        <p className="text-muted-foreground">123 Fashion Street, Suite 500<br />New York, NY 10001</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Store Hours</p>
                                        <p className="text-muted-foreground">
                                            Monday - Friday: 9:00 AM - 6:00 PM<br />
                                            Saturday: 10:00 AM - 4:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Team Section */}
                {/*<div className="mb-16 py-16 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-3xl">*/}
                {/*    <div className="container mx-auto px-4">*/}
                {/*        <div className="mb-12 text-center">*/}
                {/*            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>*/}
                {/*            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">*/}
                {/*                The passionate people behind Threadz BigAskins*/}
                {/*            </p>*/}
                {/*        </div>*/}
                {/*        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">*/}
                {/*            {teamMembers.map((member) => (*/}
                {/*                <Card key={member.name} className="overflow-hidden group hover:shadow-2xl transition-all duration-300">*/}
                {/*                    <div className="aspect-square overflow-hidden relative">*/}
                {/*                        <img*/}
                {/*                            src={member.image}*/}
                {/*                            alt={member.name}*/}
                {/*                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"*/}
                {/*                        />*/}
                {/*                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />*/}
                {/*                    </div>*/}
                {/*                    <CardContent className="pt-4 pb-6">*/}
                {/*                        <h3 className="font-bold text-lg mb-1">{member.name}</h3>*/}
                {/*                        <p className="text-sm text-primary font-medium mb-3">{member.role}</p>*/}
                {/*                        <a*/}
                {/*                            href={`mailto:${member.email}`}*/}
                {/*                            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"*/}
                {/*                        >*/}
                {/*                            <Mail className="h-3 w-3" />*/}
                {/*                            {member.email}*/}
                {/*                        </a>*/}
                {/*                    </CardContent>*/}
                {/*                </Card>*/}
                {/*            ))}*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* FAQs Section */}
                {/*<Card className="shadow-xl">*/}
                {/*    <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent pb-8">*/}
                {/*        <CardTitle className="text-4xl font-bold">Frequently Asked Questions</CardTitle>*/}
                {/*        <CardDescription className="text-lg mt-2">*/}
                {/*            Find answers to common questions about our products and services*/}
                {/*        </CardDescription>*/}
                {/*    </CardHeader>*/}
                {/*    <CardContent>*/}
                {/*        <Accordion type="single" collapsible className="w-full">*/}
                {/*            {faqs.map((faq, index) => (*/}
                {/*                <AccordionItem key={index} value={`item-${index}`}>*/}
                {/*                    <AccordionTrigger className="text-left">*/}
                {/*                        {faq.question}*/}
                {/*                    </AccordionTrigger>*/}
                {/*                    <AccordionContent className="text-muted-foreground">*/}
                {/*                        {faq.answer}*/}
                {/*                    </AccordionContent>*/}
                {/*                </AccordionItem>*/}
                {/*            ))}*/}
                {/*        </Accordion>*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}
            </div>
        </div>
    );
}
