import { useState } from 'react';
import { Mail, CheckCircle2, Circle, Clock, Building2, Phone, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useInquiries } from '@/hooks/useSiteData';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

const InquiriesPage = () => {
    const { data: inquiries = [], refetch, isLoading } = useInquiries();
    const [markingRead, setMarkingRead] = useState<string | null>(null);

    const handleMarkAsRead = async (id: string) => {
        setMarkingRead(id);
        try {
            const { error } = await supabase
                .from('inquiries')
                .update({ is_read: true })
                .eq('id', id);

            if (error) throw error;
            toast.success('Inquiry marked as read');
            refetch();
        } catch (error) {
            console.error('Error marking as read:', error);
            toast.error('Failed to update inquiry status');
        } finally {
            setMarkingRead(null);
        }
    };

    const unreadCount = inquiries.filter(i => !i.is_read).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Contact Inquiries</h1>
                    <p className="text-muted-foreground">Manage messages submitted through the contact form.</p>
                </div>
                <Badge variant={unreadCount > 0 ? "destructive" : "secondary"} className="text-sm px-3 py-1">
                    {unreadCount} Unread
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : inquiries.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No inquiries found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {inquiries.map((inquiry) => (
                                <div
                                    key={inquiry.id}
                                    className={`p-4 sm:p-6 rounded-lg border transition-colors ${!inquiry.is_read ? 'bg-muted/50 border-primary/20 shadow-sm' : 'bg-background border-border'
                                        }`}
                                >
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Header / Sender Info */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                                            {inquiry.name}
                                                            {!inquiry.is_read && (
                                                                <Badge variant="default" className="bg-primary hover:bg-primary/80">New</Badge>
                                                            )}
                                                        </h3>
                                                    </div>
                                                    <div className="space-y-1 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-3.5 w-3.5" />
                                                            <a href={`mailto:${inquiry.email}`} className="hover:text-primary transition-colors">
                                                                {inquiry.email}
                                                            </a>
                                                        </div>
                                                        {inquiry.phone && (
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="h-3.5 w-3.5" />
                                                                <a href={`tel:${inquiry.phone}`} className="hover:text-primary transition-colors">
                                                                    {inquiry.phone}
                                                                </a>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2 text-xs opacity-80 pt-1">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            {new Date(inquiry.created_at).toLocaleString('en-IN', {
                                                                dateStyle: 'medium',
                                                                timeStyle: 'short'
                                                            })}
                                                            <span className="text-muted-foreground/60 mx-1">•</span>
                                                            <Clock className="h-3 w-3 inline mr-1" />
                                                            {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                                                        </div>
                                                    </div>
                                                </div>

                                                {!inquiry.is_read && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleMarkAsRead(inquiry.id)}
                                                        disabled={markingRead === inquiry.id}
                                                        className="hidden sm:flex"
                                                    >
                                                        {markingRead === inquiry.id ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                                        ) : (
                                                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                                        )}
                                                        Mark Read
                                                    </Button>
                                                )}
                                            </div>

                                            {/* Message Content */}
                                            <div className="bg-muted/30 p-4 rounded-md mt-4 border border-border/50">
                                                <h4 className="font-medium text-sm mb-2 text-foreground/90">Subject: {inquiry.subject || 'No Subject'}</h4>
                                                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                                                    {inquiry.message}
                                                </p>
                                            </div>

                                            {/* Mobile Action Button */}
                                            {!inquiry.is_read && (
                                                <div className="sm:hidden pt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full"
                                                        onClick={() => handleMarkAsRead(inquiry.id)}
                                                        disabled={markingRead === inquiry.id}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                                        Mark as Read
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default InquiriesPage;
