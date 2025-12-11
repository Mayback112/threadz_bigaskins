import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/component/ui/card';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/component/ui/label';
import { Textarea } from '@/component/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/component/ui/select';
import { Calendar } from '@/component/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/component/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Clock, Ruler, Scissors, User, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';

const services = [
    { id: 'custom-dress', name: 'Custom Tailored Dress', price: 250, duration: '2-3 weeks' },
    { id: 'suit', name: 'Custom Suit', price: 450, duration: '3-4 weeks' },
    { id: 'shirt', name: 'Tailored Shirt', price: 80, duration: '1-2 weeks' },
    { id: 'pants', name: 'Tailored Pants', price: 120, duration: '1-2 weeks' },
    { id: 'alterations', name: 'Alterations & Adjustments', price: 50, duration: '3-5 days' },
    { id: 'bridal', name: 'Bridal Dress', price: 800, duration: '4-6 weeks' },
];

export function Booking() {
    const [date, setDate] = useState<Date>();
    const [selectedService, setSelectedService] = useState('');
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        toast({
            title: "Booking Request Submitted!",
            description: "We'll contact you within 24 hours to confirm your appointment.",
        });

        // Reset form
        e.currentTarget.reset();
        setDate(undefined);
        setSelectedService('');
    };

    const selectedServiceDetails = services.find(s => s.id === selectedService);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Book a Tailoring Service</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Schedule an appointment for custom tailored clothing. Our expert tailors will create 
                    the perfect fit just for you.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Services List */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Scissors className="w-5 h-5" />
                                Our Services
                            </CardTitle>
                            <CardDescription>Choose from our range of tailoring services</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                        selectedService === service.id
                                            ? 'border-primary bg-primary/5'
                                            : 'hover:border-gray-400'
                                    }`}
                                    onClick={() => setSelectedService(service.id)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold">{service.name}</h3>
                                        <span className="font-bold text-primary">${service.price}+</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {service.duration}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Ruler className="w-5 h-5" />
                                What to Expect
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary font-bold">1</span>
                                </div>
                                <div>
                                    <p className="font-medium">Initial Consultation</p>
                                    <p className="text-muted-foreground">Discuss your requirements and preferences</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary font-bold">2</span>
                                </div>
                                <div>
                                    <p className="font-medium">Measurements & Fabric Selection</p>
                                    <p className="text-muted-foreground">Precise measurements and choose from premium fabrics</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary font-bold">3</span>
                                </div>
                                <div>
                                    <p className="font-medium">First Fitting</p>
                                    <p className="text-muted-foreground">Try on and make any necessary adjustments</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary font-bold">4</span>
                                </div>
                                <div>
                                    <p className="font-medium">Final Delivery</p>
                                    <p className="text-muted-foreground">Receive your perfectly tailored garment</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Booking Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Book Your Appointment</CardTitle>
                        <CardDescription>Fill in your details to schedule a consultation</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Service Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="service">Select Service *</Label>
                                <Select name="service" value={selectedService} onValueChange={setSelectedService} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.map((service) => (
                                            <SelectItem key={service.id} value={service.id}>
                                                {service.name} - ${service.price}+
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedServiceDetails && (
                                    <p className="text-sm text-muted-foreground">
                                        Estimated completion: {selectedServiceDetails.duration}
                                    </p>
                                )}
                            </div>

                            {/* Personal Information */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="firstName" name="firstName" placeholder="John" className="pl-9" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input id="lastName" name="lastName" placeholder="Doe" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="email" name="email" type="email" placeholder="john@example.com" className="pl-9" required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" className="pl-9" required />
                                </div>
                            </div>

                            {/* Preferred Date */}
                            <div className="space-y-2">
                                <Label>Preferred Appointment Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* Time Slot */}
                            <div className="space-y-2">
                                <Label htmlFor="time">Preferred Time *</Label>
                                <Select name="time" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a time slot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="9:00">9:00 AM</SelectItem>
                                        <SelectItem value="10:00">10:00 AM</SelectItem>
                                        <SelectItem value="11:00">11:00 AM</SelectItem>
                                        <SelectItem value="12:00">12:00 PM</SelectItem>
                                        <SelectItem value="13:00">1:00 PM</SelectItem>
                                        <SelectItem value="14:00">2:00 PM</SelectItem>
                                        <SelectItem value="15:00">3:00 PM</SelectItem>
                                        <SelectItem value="16:00">4:00 PM</SelectItem>
                                        <SelectItem value="17:00">5:00 PM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Additional Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Additional Notes</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    placeholder="Tell us about your requirements, style preferences, or any special requests..."
                                    rows={4}
                                />
                            </div>

                            <Button type="submit" className="w-full" size="lg">
                                Book Appointment
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                By booking, you agree to our terms and conditions. We'll send you a confirmation email shortly.
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
