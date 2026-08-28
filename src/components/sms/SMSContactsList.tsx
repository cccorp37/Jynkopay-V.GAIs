import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Plus, 
  Trash2, 
  Upload,
  Search,
  X,
  Phone,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSMSContacts } from "@/hooks/useSMSContacts";

interface SMSContactsListProps {
  onClose?: () => void;
  selectionMode?: boolean;
  onSelect?: (phones: string[]) => void;
}

export function SMSContactsList({ onClose, selectionMode = false, onSelect }: SMSContactsListProps) {
  const { 
    contacts, 
    groups, 
    loading, 
    addContact, 
    addMultipleContacts,
    deleteContact, 
    deleteMultipleContacts 
  } = useSMSContacts();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Add form state
  const [newPhone, setNewPhone] = useState("");
  const [newName, setNewName] = useState("");
  const [newGroup, setNewGroup] = useState("default");
  
  // Import state
  const [importData, setImportData] = useState("");

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = 
      contact.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.name?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesGroup = selectedFilter === "all" || contact.group_name === selectedFilter;
    return matchesSearch && matchesGroup;
  });

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    await addContact(newPhone, newName || undefined, newGroup);
    setNewPhone("");
    setNewName("");
    setShowAddForm(false);
  };

  const handleImport = async () => {
    const lines = importData.split("\n").filter(l => l.trim());
    const contactsToAdd = lines.map(line => {
      const parts = line.split(/[,;|\t]/).map(p => p.trim());
      return {
        phone: parts[0],
        name: parts[1] || undefined,
        groupName: parts[2] || "default",
      };
    });
    
    await addMultipleContacts(contactsToAdd);
    setImportData("");
    setShowImport(false);
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredContacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const handleConfirmSelection = () => {
    const selectedPhones = contacts
      .filter(c => selectedIds.has(c.id))
      .map(c => c.phone);
    onSelect?.(selectedPhones);
  };

  const handleDeleteSelected = async () => {
    await deleteMultipleContacts(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[rgba(0,200,150,0.15)] flex items-center justify-center">
            <Users className="text-[#00C896]" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white">Contacts SMS</h3>
            <p className="text-sm text-[#9CA3AF]">{contacts.length} contacts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowImport(!showImport)}
          >
            <Upload size={16} className="mr-2" />
            Importer
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={16} className="mr-2" />
            Ajouter
          </Button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            >
              <X size={20} className="text-[#9CA3AF]" />
            </button>
          )}
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleAddContact}
          className="mb-6 p-4 rounded-xl bg-[rgba(21,25,50,0.5)] border border-[rgba(45,51,82,0.5)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Numéro de téléphone *</Label>
              <Input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+237699123456"
                required
                className="bg-[rgba(21,25,50,0.5)] border-[rgba(45,51,82,0.5)] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Nom (optionnel)</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Jean Dupont"
                className="bg-[rgba(21,25,50,0.5)] border-[rgba(45,51,82,0.5)] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Groupe</Label>
              <Input
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                placeholder="default"
                className="bg-[rgba(21,25,50,0.5)] border-[rgba(45,51,82,0.5)] text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter
            </Button>
          </div>
        </motion.form>
      )}

      {/* Import Form */}
      {showImport && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 rounded-xl bg-[rgba(21,25,50,0.5)] border border-[rgba(45,51,82,0.5)]"
        >
          <Label className="text-white mb-2 block">
            Collez vos contacts (un par ligne: numéro, nom, groupe)
          </Label>
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="+237699123456, Jean Dupont, clients&#10;+237698765432, Marie Martin, prospects"
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-[rgba(21,25,50,0.5)] border border-[rgba(45,51,82,0.5)] text-white font-mono text-sm resize-none"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setShowImport(false)}>
              Annuler
            </Button>
            <Button onClick={handleImport} disabled={!importData.trim()}>
              Importer
            </Button>
          </div>
        </motion.div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un contact..."
            className="pl-10 bg-[rgba(21,25,50,0.5)] border-[rgba(45,51,82,0.5)] text-white"
          />
        </div>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-[rgba(21,25,50,0.5)] border border-[rgba(45,51,82,0.5)] text-white"
        >
          <option value="all">Tous les groupes</option>
          {groups.map((group) => (
            <option key={group.name} value={group.name}>
              {group.name} ({group.count})
            </option>
          ))}
        </select>
      </div>

      {/* Selection Actions */}
      {(selectionMode || selectedIds.size > 0) && (
        <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-[rgba(108,63,245,0.1)] border border-[rgba(108,63,245,0.3)]">
          <div className="flex items-center gap-3">
            <button
              onClick={selectAll}
              className="text-sm text-[#6C3FF5] hover:underline"
            >
              {selectedIds.size === filteredContacts.length ? "Désélectionner tout" : "Sélectionner tout"}
            </button>
            <span className="text-sm text-[#9CA3AF]">
              {selectedIds.size} sélectionné{selectedIds.size > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex gap-2">
            {!selectionMode && selectedIds.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
              >
                <Trash2 size={14} className="mr-1" />
                Supprimer
              </Button>
            )}
            {selectionMode && (
              <Button
                size="sm"
                onClick={handleConfirmSelection}
                disabled={selectedIds.size === 0}
              >
                Confirmer ({selectedIds.size})
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Contacts List */}
      {loading ? (
        <div className="text-center py-12 text-[#9CA3AF]">
          Chargement...
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-12 text-[#9CA3AF]">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p>Aucun contact trouvé</p>
          <p className="text-sm mt-2">Ajoutez des contacts pour commencer vos campagnes SMS</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                selectedIds.has(contact.id)
                  ? "bg-[rgba(108,63,245,0.15)] border-[rgba(108,63,245,0.5)]"
                  : "bg-[rgba(21,25,50,0.5)] border-[rgba(45,51,82,0.5)] hover:border-[rgba(108,63,245,0.3)]"
              }`}
              onClick={() => toggleSelect(contact.id)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedIds.has(contact.id)
                  ? "bg-[#6C3FF5] text-white"
                  : "bg-[rgba(0,200,150,0.15)]"
              }`}>
                {selectedIds.has(contact.id) ? (
                  <span className="text-sm">✓</span>
                ) : (
                  <User className="text-[#00C896]" size={18} />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">
                    {contact.name || contact.phone}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-xs bg-[rgba(108,63,245,0.15)] text-[#6C3FF5]">
                    {contact.group_name}
                  </span>
                </div>
                {contact.name && (
                  <div className="flex items-center gap-1 text-sm text-[#6B7280]">
                    <Phone size={12} />
                    {contact.phone}
                  </div>
                )}
              </div>

              {!selectionMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteContact(contact.id);
                  }}
                  className="p-2 rounded-lg hover:bg-[rgba(255,71,87,0.1)] transition-colors"
                >
                  <Trash2 size={16} className="text-[#FF4757]" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
