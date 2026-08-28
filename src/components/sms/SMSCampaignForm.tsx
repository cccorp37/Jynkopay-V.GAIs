import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  Users, 
  Clock, 
  FileUp,
  X,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useSMSContacts } from "@/hooks/useSMSContacts";

interface SMSCampaignFormProps {
  onSubmit: (data: {
    name: string;
    messageContent: string;
    senderName: string;
    recipients: string[];
    sendNow: boolean;
    scheduledAt?: string;
  }) => Promise<void>;
  onCancel: () => void;
  sending?: boolean;
}

const MAX_SMS_LENGTH = 160;
const MAX_SMS_PARTS = 3;

export function SMSCampaignForm({ onSubmit, onCancel, sending = false }: SMSCampaignFormProps) {
  const { contacts, groups, getAllPhones, getPhonesByGroup } = useSMSContacts();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("Jynkopay");
  const [recipientMode, setRecipientMode] = useState<"all" | "group" | "manual">("all");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [manualNumbers, setManualNumbers] = useState("");
  const [sendNow, setSendNow] = useState(true);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const messageLength = message.length;
  const smsCount = Math.ceil(messageLength / MAX_SMS_LENGTH) || 1;
  const remainingChars = (smsCount * MAX_SMS_LENGTH) - messageLength;
  const isMessageTooLong = smsCount > MAX_SMS_PARTS;

  const getRecipients = (): string[] => {
    switch (recipientMode) {
      case "all":
        return getAllPhones();
      case "group":
        return selectedGroup ? getPhonesByGroup(selectedGroup) : [];
      case "manual":
        return manualNumbers
          .split(/[,\n]/)
          .map(n => n.trim())
          .filter(n => n.length > 0)
          .map(n => n.startsWith("+") ? n : `+${n}`);
      default:
        return [];
    }
  };

  const recipientCount = getRecipients().length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const recipients = getRecipients();
    if (recipients.length === 0) {
      return;
    }

    let scheduledAt: string | undefined;
    if (!sendNow && scheduledDate && scheduledTime) {
      scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    }

    await onSubmit({
      name,
      messageContent: message,
      senderName,
      recipients,
      sendNow,
      scheduledAt,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-bold text-white">Nouvelle campagne SMS</h3>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
        >
          <X size={20} className="text-[#9CA3AF]" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom de la campagne */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Nom de la campagne</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Promo weekend"
            required
            className="bg-[rgba(21,25,50,0.5)] border-[rgba(45,51,82,0.5)] text-white"
          />
        </div>

        {/* Nom de l'expéditeur */}
        <div className="space-y-2">
          <Label htmlFor="sender" className="text-white">Nom de l'expéditeur</Label>
          <Input
            id="sender"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value.slice(0, 11))}
            placeholder="Jynkopay"
            maxLength={11}
            className="bg-[rgba(21,25,50,0.5)] border-[rgba(45,51,82,0.5)] text-white"
          />
          <p className="text-xs text-[#6B7280]">Max 11 caractères alphanumériques</p>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-white">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez votre message ici..."
            required
            rows={4}
            className="bg-[rgba(21,25,50,0.5)] border-[rgba(45,51,82,0.5)] text-white resize-none"
          />
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {isMessageTooLong && (
                <span className="text-[#FF4757] flex items-center gap-1">
                  <AlertCircle size={12} />
                  Message trop long (max {MAX_SMS_PARTS} SMS)
                </span>
              )}
            </div>
            <span className={`${isMessageTooLong ? "text-[#FF4757]" : "text-[#6B7280]"}`}>
              {messageLength}/{smsCount * MAX_SMS_LENGTH} ({smsCount} SMS) • {remainingChars} restants
            </span>
          </div>
        </div>

        {/* Destinataires */}
        <div className="space-y-4">
          <Label className="text-white">Destinataires</Label>
          
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setRecipientMode("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                recipientMode === "all"
                  ? "bg-[#6C3FF5] text-white"
                  : "bg-[rgba(21,25,50,0.5)] text-[#9CA3AF] hover:text-white border border-[rgba(45,51,82,0.5)]"
              }`}
            >
              <Users size={14} className="inline-block mr-2" />
              Tous les contacts ({contacts.length})
            </button>
            <button
              type="button"
              onClick={() => setRecipientMode("group")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                recipientMode === "group"
                  ? "bg-[#6C3FF5] text-white"
                  : "bg-[rgba(21,25,50,0.5)] text-[#9CA3AF] hover:text-white border border-[rgba(45,51,82,0.5)]"
              }`}
            >
              Par groupe
            </button>
            <button
              type="button"
              onClick={() => setRecipientMode("manual")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                recipientMode === "manual"
                  ? "bg-[#6C3FF5] text-white"
                  : "bg-[rgba(21,25,50,0.5)] text-[#9CA3AF] hover:text-white border border-[rgba(45,51,82,0.5)]"
              }`}
            >
              <FileUp size={14} className="inline-block mr-2" />
              Saisie manuelle
            </button>
          </div>

          {recipientMode === "group" && (
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[rgba(21,25,50,0.5)] border border-[rgba(45,51,82,0.5)] text-white"
            >
              <option value="">Sélectionner un groupe</option>
              {groups.map((group) => (
                <option key={group.name} value={group.name}>
                  {group.name} ({group.count} contacts)
                </option>
              ))}
            </select>
          )}

          {recipientMode === "manual" && (
            <Textarea
              value={manualNumbers}
              onChange={(e) => setManualNumbers(e.target.value)}
              placeholder="Entrez les numéros (un par ligne ou séparés par des virgules)&#10;Ex: +237699123456, +237698765432"
              rows={4}
              className="bg-[rgba(21,25,50,0.5)] border-[rgba(45,51,82,0.5)] text-white resize-none font-mono text-sm"
            />
          )}

          <p className="text-sm text-[#6B7280]">
            {recipientCount} destinataire{recipientCount > 1 ? "s" : ""} sélectionné{recipientCount > 1 ? "s" : ""}
          </p>
        </div>

        {/* Planification */}
        <div className="space-y-4">
          <Label className="text-white">Envoi</Label>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSendNow(true)}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                sendNow
                  ? "bg-[#6C3FF5] text-white"
                  : "bg-[rgba(21,25,50,0.5)] text-[#9CA3AF] hover:text-white border border-[rgba(45,51,82,0.5)]"
              }`}
            >
              <Send size={14} className="inline-block mr-2" />
              Envoyer maintenant
            </button>
            <button
              type="button"
              onClick={() => setSendNow(false)}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                !sendNow
                  ? "bg-[#6C3FF5] text-white"
                  : "bg-[rgba(21,25,50,0.5)] text-[#9CA3AF] hover:text-white border border-[rgba(45,51,82,0.5)]"
              }`}
            >
              <Clock size={14} className="inline-block mr-2" />
              Programmer
            </button>
          </div>

          {!sendNow && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="bg-[rgba(21,25,50,0.5)] border-[rgba(45,51,82,0.5)] text-white"
              />
              <Input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="bg-[rgba(21,25,50,0.5)] border-[rgba(45,51,82,0.5)] text-white"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={sending || recipientCount === 0 || isMessageTooLong || !name || !message}
            className="flex-1"
          >
            {sending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Envoi en cours...
              </>
            ) : sendNow ? (
              <>
                <Send size={16} className="mr-2" />
                Envoyer ({recipientCount})
              </>
            ) : (
              <>
                <Clock size={16} className="mr-2" />
                Programmer
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
