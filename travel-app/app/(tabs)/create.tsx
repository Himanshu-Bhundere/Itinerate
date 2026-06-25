import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet, Image, KeyboardAvoidingView, Platform, Modal, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// ─── Indian Cities for Destination Autocomplete ───
const INDIAN_CITIES = [
  'Kedarnath, Uttarakhand', 'Manali, Himachal Pradesh', 'Leh, Ladakh',
  'Rishikesh, Uttarakhand', 'Goa', 'Jaipur, Rajasthan',
  'Udaipur, Rajasthan', 'Varanasi, Uttar Pradesh', 'Shimla, Himachal Pradesh',
  'Darjeeling, West Bengal', 'Munnar, Kerala', 'Alleppey, Kerala',
  'Hampi, Karnataka', 'Andaman Islands', 'Kasol, Himachal Pradesh',
  'Spiti Valley, Himachal Pradesh', 'Coorg, Karnataka', 'Ooty, Tamil Nadu',
  'McLeod Ganj, Himachal Pradesh', 'Mussoorie, Uttarakhand',
  'Nainital, Uttarakhand', 'Kodaikanal, Tamil Nadu', 'Jodhpur, Rajasthan',
  'Pushkar, Rajasthan', 'Amritsar, Punjab', 'Agra, Uttar Pradesh',
  'Mumbai, Maharashtra', 'Delhi', 'New Delhi',
  'Bengaluru, Karnataka', 'Chennai, Tamil Nadu', 'Kolkata, West Bengal',
  'Hyderabad, Telangana', 'Pune, Maharashtra', 'Ahmedabad, Gujarat',
  'Srinagar, Jammu & Kashmir', 'Gangtok, Sikkim', 'Shillong, Meghalaya',
  'Tawang, Arunachal Pradesh', 'Pondicherry', 'Khajuraho, Madhya Pradesh',
  'Rann of Kutch, Gujarat', 'Valley of Flowers, Uttarakhand',
  'Dalhousie, Himachal Pradesh', 'Lansdowne, Uttarakhand',
  'Jim Corbett, Uttarakhand', 'Auli, Uttarakhand',
  'Chopta, Uttarakhand', 'Bir Billing, Himachal Pradesh',
  'Zanskar Valley, Ladakh', 'Pangong Lake, Ladakh',
  'Nubra Valley, Ladakh', 'Tirthan Valley, Himachal Pradesh',
];

// ─── Duration Presets ───
const DURATION_PRESETS = [
  { label: '1 Day / 0 Nights', days: 1, nights: 0 },
  { label: '2 Days / 1 Night', days: 2, nights: 1 },
  { label: '3 Days / 2 Nights', days: 3, nights: 2 },
  { label: '4 Days / 3 Nights', days: 4, nights: 3 },
  { label: '5 Days / 4 Nights', days: 5, nights: 4 },
  { label: '6 Days / 5 Nights', days: 6, nights: 5 },
  { label: '7 Days / 6 Nights', days: 7, nights: 6 },
  { label: '10 Days / 9 Nights', days: 10, nights: 9 },
  { label: '14 Days / 13 Nights', days: 14, nights: 13 },
  { label: '15 Days / 14 Nights', days: 15, nights: 14 },
];

// ─── Budget Presets ───
const BUDGET_PRESETS = [
  { label: '₹0 – ₹5,000', value: '0-5000' },
  { label: '₹5,000 – ₹10,000', value: '5000-10000' },
  { label: '₹10,000 – ₹20,000', value: '10000-20000' },
  { label: '₹20,000 – ₹50,000', value: '20000-50000' },
  { label: '₹50,000 – ₹1,00,000', value: '50000-100000' },
  { label: '₹1,00,000+', value: '100000+' },
];

export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  const [durationLabel, setDurationLabel] = useState('');
  const [durationDays, setDurationDays] = useState(0);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [customDays, setCustomDays] = useState('');
  const [customNights, setCustomNights] = useState('');
  const [durationMode, setDurationMode] = useState<'presets' | 'custom'>('presets');
  
  const [budgetLabel, setBudgetLabel] = useState('');
  const [budgetValue, setBudgetValue] = useState('');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetMode, setBudgetMode] = useState<'presets' | 'custom'>('presets');
  const [customBudget, setCustomBudget] = useState('');
  
  const [travelStyles, setTravelStyles] = useState<string[]>(['Backpacking']);
  const [loading, setLoading] = useState(false);
  const session = useAuthStore(state => state.session);
  const router = useRouter();

  const allStyles = ['Backpacking', 'Adventure', 'Relaxation', 'Culture'];

  const toggleStyle = (style: string) => {
    if (travelStyles.includes(style)) {
      setTravelStyles(travelStyles.filter(s => s !== style));
    } else {
      setTravelStyles([...travelStyles, style]);
    }
  };

  // Filtered cities for autocomplete
  const filteredCities = useMemo(() => {
    if (!locationQuery || locationQuery.length < 2) return [];
    const q = locationQuery.toLowerCase();
    return INDIAN_CITIES.filter(c => c.toLowerCase().includes(q)).slice(0, 8);
  }, [locationQuery]);

  const selectCity = (city: string) => {
    setLocation(city);
    setLocationQuery(city);
    setShowLocationDropdown(false);
  };

  const selectDuration = (item: typeof DURATION_PRESETS[0]) => {
    setDurationLabel(item.label);
    setDurationDays(item.days);
    setShowDurationModal(false);
    setDurationMode('presets');
  };

  const confirmCustomDuration = () => {
    const d = parseInt(customDays) || 0;
    const n = parseInt(customNights) || 0;
    if (d <= 0) {
      Alert.alert('Invalid', 'Days must be at least 1');
      return;
    }
    setDurationLabel(`${d} Day${d > 1 ? 's' : ''} / ${n} Night${n !== 1 ? 's' : ''}`);
    setDurationDays(d);
    setShowDurationModal(false);
  };

  const selectBudget = (item: typeof BUDGET_PRESETS[0]) => {
    setBudgetLabel(item.label);
    setBudgetValue(item.value);
    setShowBudgetModal(false);
    setBudgetMode('presets');
  };

  const confirmCustomBudget = () => {
    const val = parseInt(customBudget) || 0;
    if (val <= 0) {
      Alert.alert('Invalid', 'Please enter a valid budget');
      return;
    }
    const formatted = `₹${val.toLocaleString('en-IN')}`;
    setBudgetLabel(formatted);
    setBudgetValue(String(val));
    setShowBudgetModal(false);
  };

  async function handleCreatePlan() {
    if (!title || !location || !durationDays) {
      Alert.alert('Missing Info', 'Please fill in Plan Title, Destination, and Duration.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.from('plans').insert({
      title,
      location,
      duration_days: durationDays,
      budget_level: budgetValue || 'not-set',
      category: travelStyles[0]?.toLowerCase() || 'general',
      visibility: 'public',
      user_id: session?.user?.id,
    }).select().single();

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else if (data) {
      router.push({ pathname: '/publish_success', params: { plan_id: data.id, plan_title: data.title } });
    }
  }

  // ──────────────── RENDER ────────────────

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.headerIconBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Create New Itinerary</Text>
          <TouchableOpacity style={s.headerIconBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Stepper */}
        <View style={s.stepper}>
          {['Basic Info', 'Itinerary', 'Activities', 'Stay', 'Review'].map((step, idx) => (
            <React.Fragment key={step}>
              {idx > 0 && <View style={s.stepLine} />}
              <View style={s.stepItem}>
                <View style={[s.stepCircle, idx === 0 && s.stepCircleActive]}>
                  <Text style={[s.stepNum, idx === 0 && s.stepNumActive]}>{idx + 1}</Text>
                </View>
                <Text style={[s.stepLabel, idx === 0 && s.stepLabelActive]}>{step}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* Hero */}
          <View style={s.hero}>
            <View style={{ flex: 1, paddingRight: 16 }}>
              <Text style={s.heroTitle}>Let's start with the basics ✨</Text>
              <Text style={s.heroSub}>Fill in a few details to build your perfect trip.</Text>
            </View>
            <View style={s.heroIllustration}>
              <Ionicons name="map-outline" size={48} color="#0ea5e9" />
              <View style={s.heroPinBadge}><Ionicons name="location" size={16} color="#fff" /></View>
            </View>
          </View>

          {/* Form Card */}
          <View style={s.card}>
            
            {/* Plan Title */}
            <Text style={s.label}>Plan Title</Text>
            <View style={s.inputRow}>
              <View style={[s.inputIcon, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
              </View>
              <TextInput
                style={s.input}
                placeholder="Kedarnath Trek Adventure"
                placeholderTextColor="#94a3b8"
                value={title}
                onChangeText={setTitle}
                maxLength={80}
              />
              <Text style={s.charCount}>{title.length}/80</Text>
            </View>

            {/* Destination with Autocomplete */}
            <Text style={s.label}>Destination</Text>
            <View style={{ position: 'relative', zIndex: 100 }}>
              <View style={s.inputRow}>
                <View style={[s.inputIcon, { backgroundColor: '#ecfdf5' }]}>
                  <Ionicons name="location-outline" size={20} color="#10b981" />
                </View>
                <TextInput
                  style={s.input}
                  placeholder="Search destination..."
                  placeholderTextColor="#94a3b8"
                  value={locationQuery}
                  onChangeText={(text) => {
                    setLocationQuery(text);
                    setLocation(text);
                    setShowLocationDropdown(text.length >= 2);
                  }}
                  onFocus={() => { if (locationQuery.length >= 2) setShowLocationDropdown(true); }}
                />
                <Ionicons name="chevron-down" size={20} color="#64748b" style={{ marginRight: 12 }} />
              </View>
              
              {/* Autocomplete Dropdown */}
              {showLocationDropdown && filteredCities.length > 0 && (
                <View style={s.autocompleteDropdown}>
                  {filteredCities.map((city, idx) => (
                    <TouchableOpacity key={idx} style={s.autocompleteItem} onPress={() => selectCity(city)}>
                      <Ionicons name="location" size={16} color="#3b82f6" style={{ marginRight: 12 }} />
                      <Text style={s.autocompleteText}>{city}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Duration Dropdown */}
            <Text style={s.label}>Duration</Text>
            <TouchableOpacity style={s.inputRow} onPress={() => setShowDurationModal(true)}>
              <View style={[s.inputIcon, { backgroundColor: '#eff6ff' }]}>
                <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
              </View>
              <Text style={[s.inputPlaceholder, durationLabel && s.inputValue]}>
                {durationLabel || '4 Days / 3 Nights'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#64748b" style={{ marginRight: 12 }} />
            </TouchableOpacity>

            {/* Budget Dropdown */}
            <Text style={s.label}>Budget <Text style={{ color: '#94a3b8', fontWeight: '400' }}>(per person)</Text></Text>
            <TouchableOpacity style={s.inputRow} onPress={() => setShowBudgetModal(true)}>
              <View style={[s.inputIcon, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="wallet-outline" size={20} color="#10b981" />
              </View>
              <Text style={[s.inputPlaceholder, budgetLabel && s.inputValue]}>
                {budgetLabel || '₹8,000 - ₹10,000'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#64748b" style={{ marginRight: 12 }} />
            </TouchableOpacity>

            {/* Travel Style */}
            <Text style={s.label}>Travel Style</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {allStyles.map((item) => {
                const isActive = travelStyles.includes(item);
                return (
                  <TouchableOpacity key={item} style={[s.stylePill, isActive && s.stylePillActive]} onPress={() => toggleStyle(item)}>
                    <MaterialCommunityIcons
                      name={item === 'Backpacking' ? 'bag-personal' : item === 'Adventure' ? 'image-filter-hdr' : item === 'Relaxation' ? 'beach' : 'bank'}
                      size={18} color={isActive ? '#f97316' : '#64748b'} style={{ marginRight: 6 }}
                    />
                    <Text style={[s.stylePillText, isActive && s.stylePillTextActive]}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="bulb-outline" size={14} color="#f97316" />
              <Text style={{ fontSize: 12, color: '#64748b', marginLeft: 6 }}>You can select multiple styles</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={s.bottomActions}>
          <TouchableOpacity onPress={handleCreatePlan} disabled={loading}>
            <View style={s.nextBtn}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Text style={s.nextBtnText}>Next</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" style={{ position: 'absolute', right: 24 }} />
                </>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={s.draftBtn}>
            <Ionicons name="bookmark-outline" size={18} color="#2563eb" style={{ marginRight: 8 }} />
            <Text style={s.draftBtnText}>Save Draft</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>

      {/* ──── Duration Modal ──── */}
      <Modal visible={showDurationModal} transparent animationType="slide" onRequestClose={() => setShowDurationModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Select Duration</Text>
              <TouchableOpacity onPress={() => setShowDurationModal(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            {/* Tabs: Presets / Custom */}
            <View style={s.modalTabs}>
              <TouchableOpacity style={[s.modalTab, durationMode === 'presets' && s.modalTabActive]} onPress={() => setDurationMode('presets')}>
                <Ionicons name="list-outline" size={16} color={durationMode === 'presets' ? '#2563eb' : '#64748b'} style={{ marginRight: 6 }} />
                <Text style={[s.modalTabText, durationMode === 'presets' && s.modalTabTextActive]}>Presets</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalTab, durationMode === 'custom' && s.modalTabActive]} onPress={() => setDurationMode('custom')}>
                <Ionicons name="create-outline" size={16} color={durationMode === 'custom' ? '#2563eb' : '#64748b'} style={{ marginRight: 6 }} />
                <Text style={[s.modalTabText, durationMode === 'custom' && s.modalTabTextActive]}>Custom</Text>
              </TouchableOpacity>
            </View>

            {durationMode === 'presets' ? (
              <FlatList
                data={DURATION_PRESETS}
                keyExtractor={(item) => item.label}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[s.modalOption, durationLabel === item.label && s.modalOptionSelected]}
                    onPress={() => selectDuration(item)}
                  >
                    <View style={[s.modalOptionIcon, { backgroundColor: '#eff6ff' }]}>
                      <Ionicons name="calendar" size={18} color="#3b82f6" />
                    </View>
                    <Text style={[s.modalOptionText, durationLabel === item.label && s.modalOptionTextSelected]}>{item.label}</Text>
                    {durationLabel === item.label && <Ionicons name="checkmark-circle" size={22} color="#2563eb" />}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={s.customDurationContainer}>
                <Text style={s.customLabel}>Enter your trip duration</Text>
                
                <View style={s.customInputRow}>
                  <View style={s.customInputBlock}>
                    <Text style={s.customInputLabel}>Days</Text>
                    <View style={s.customInputBox}>
                      <TouchableOpacity style={s.counterBtn} onPress={() => setCustomDays(String(Math.max(1, (parseInt(customDays) || 1) - 1)))}>
                        <Ionicons name="remove" size={20} color="#2563eb" />
                      </TouchableOpacity>
                      <TextInput
                        style={s.counterInput}
                        value={customDays}
                        onChangeText={setCustomDays}
                        keyboardType="number-pad"
                        placeholder="0"
                        placeholderTextColor="#94a3b8"
                        maxLength={2}
                      />
                      <TouchableOpacity style={s.counterBtn} onPress={() => setCustomDays(String(Math.min(30, (parseInt(customDays) || 0) + 1)))}>
                        <Ionicons name="add" size={20} color="#2563eb" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={s.customInputBlock}>
                    <Text style={s.customInputLabel}>Nights</Text>
                    <View style={s.customInputBox}>
                      <TouchableOpacity style={s.counterBtn} onPress={() => setCustomNights(String(Math.max(0, (parseInt(customNights) || 1) - 1)))}>
                        <Ionicons name="remove" size={20} color="#2563eb" />
                      </TouchableOpacity>
                      <TextInput
                        style={s.counterInput}
                        value={customNights}
                        onChangeText={setCustomNights}
                        keyboardType="number-pad"
                        placeholder="0"
                        placeholderTextColor="#94a3b8"
                        maxLength={2}
                      />
                      <TouchableOpacity style={s.counterBtn} onPress={() => setCustomNights(String(Math.min(30, (parseInt(customNights) || 0) + 1)))}>
                        <Ionicons name="add" size={20} color="#2563eb" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {(parseInt(customDays) > 0) && (
                  <View style={s.customPreview}>
                    <Ionicons name="time-outline" size={18} color="#2563eb" style={{ marginRight: 8 }} />
                    <Text style={s.customPreviewText}>
                      {customDays || '0'} Day{(parseInt(customDays) || 0) !== 1 ? 's' : ''} / {customNights || '0'} Night{(parseInt(customNights) || 0) !== 1 ? 's' : ''}
                    </Text>
                  </View>
                )}

                <TouchableOpacity style={s.customConfirmBtn} onPress={confirmCustomDuration}>
                  <Text style={s.customConfirmText}>Confirm Duration</Text>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ──── Budget Modal ──── */}
      <Modal visible={showBudgetModal} transparent animationType="slide" onRequestClose={() => setShowBudgetModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Select Budget (per person)</Text>
              <TouchableOpacity onPress={() => setShowBudgetModal(false)}>
                <Ionicons name="close" size={24} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <View style={s.modalTabs}>
              <TouchableOpacity style={[s.modalTab, budgetMode === 'presets' && s.modalTabActive]} onPress={() => setBudgetMode('presets')}>
                <Ionicons name="list-outline" size={16} color={budgetMode === 'presets' ? '#2563eb' : '#64748b'} style={{ marginRight: 6 }} />
                <Text style={[s.modalTabText, budgetMode === 'presets' && s.modalTabTextActive]}>Presets</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalTab, budgetMode === 'custom' && s.modalTabActive]} onPress={() => setBudgetMode('custom')}>
                <Ionicons name="create-outline" size={16} color={budgetMode === 'custom' ? '#2563eb' : '#64748b'} style={{ marginRight: 6 }} />
                <Text style={[s.modalTabText, budgetMode === 'custom' && s.modalTabTextActive]}>Custom</Text>
              </TouchableOpacity>
            </View>

            {budgetMode === 'presets' ? (
              <FlatList
                data={BUDGET_PRESETS}
                keyExtractor={(item) => item.value}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[s.modalOption, budgetLabel === item.label && s.modalOptionSelected]}
                    onPress={() => selectBudget(item)}
                  >
                    <View style={[s.modalOptionIcon, { backgroundColor: '#f0fdf4' }]}>
                      <Ionicons name="wallet" size={18} color="#10b981" />
                    </View>
                    <Text style={[s.modalOptionText, budgetLabel === item.label && s.modalOptionTextSelected]}>{item.label}</Text>
                    {budgetLabel === item.label && <Ionicons name="checkmark-circle" size={22} color="#2563eb" />}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={s.customDurationContainer}>
                <Text style={s.customLabel}>Enter your budget per person</Text>
                <View style={[s.inputRow, { marginBottom: 24 }]}>
                  <View style={[s.inputIcon, { backgroundColor: '#f0fdf4' }]}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#10b981' }}>₹</Text>
                  </View>
                  <TextInput
                    style={s.input}
                    placeholder="Enter amount"
                    placeholderTextColor="#94a3b8"
                    value={customBudget}
                    onChangeText={setCustomBudget}
                    keyboardType="number-pad"
                  />
                </View>

                {(parseInt(customBudget) > 0) && (
                  <View style={s.customPreview}>
                    <Ionicons name="wallet-outline" size={18} color="#10b981" style={{ marginRight: 8 }} />
                    <Text style={s.customPreviewText}>₹{parseInt(customBudget).toLocaleString('en-IN')} per person</Text>
                  </View>
                )}

                <TouchableOpacity style={[s.customConfirmBtn, { backgroundColor: '#10b981' }]} onPress={confirmCustomBudget}>
                  <Text style={s.customConfirmText}>Confirm Budget</Text>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1, backgroundColor: '#f8fafc' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff' },
  headerIconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },

  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff' },
  stepItem: { alignItems: 'center' },
  stepCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginBottom: 4 },
  stepCircleActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  stepNum: { fontSize: 12, fontWeight: '600', color: '#94a3b8' },
  stepNumActive: { color: '#fff', fontWeight: '700' },
  stepLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '500' },
  stepLabelActive: { color: '#2563eb', fontWeight: '600' },
  stepLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0', marginHorizontal: 8, marginBottom: 16 },

  scrollContent: { padding: 20, paddingBottom: 160 },

  hero: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 8, lineHeight: 30 },
  heroSub: { fontSize: 14, color: '#64748b', lineHeight: 20 },
  heroIllustration: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center' },
  heroPinBadge: { position: 'absolute', top: -5, right: -5, width: 28, height: 28, borderRadius: 14, backgroundColor: '#0ea5e9', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#f8fafc' },

  card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },

  label: { fontSize: 14, fontWeight: '600', color: '#0f172a', marginBottom: 8, marginTop: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, height: 56, marginBottom: 16 },
  inputIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: '#0f172a' },
  charCount: { fontSize: 12, color: '#94a3b8', marginRight: 16 },
  inputPlaceholder: { flex: 1, fontSize: 15, color: '#94a3b8' },
  inputValue: { color: '#0f172a' },

  autocompleteDropdown: { position: 'absolute', top: 58, left: 0, right: 0, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10, zIndex: 1000, maxHeight: 280 },
  autocompleteItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  autocompleteText: { fontSize: 14, color: '#0f172a', fontWeight: '500' },

  stylePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', marginRight: 12 },
  stylePillActive: { borderColor: '#f97316', backgroundColor: '#fff7ed' },
  stylePillText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  stylePillTextActive: { color: '#f97316' },

  bottomActions: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  nextBtn: { backgroundColor: '#2563eb', height: 56, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  draftBtn: { height: 56, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  draftBtnText: { fontSize: 16, fontWeight: '600', color: '#2563eb' },

  // ── Modal Styles ──
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, maxHeight: height * 0.7, paddingHorizontal: 20, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#cbd5e1', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },

  modalTabs: { flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 12, padding: 4, marginBottom: 20 },
  modalTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8 },
  modalTabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  modalTabText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  modalTabTextActive: { color: '#2563eb' },

  modalOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, marginBottom: 8 },
  modalOptionSelected: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe' },
  modalOptionIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  modalOptionText: { flex: 1, fontSize: 15, fontWeight: '500', color: '#0f172a' },
  modalOptionTextSelected: { fontWeight: '700', color: '#2563eb' },

  // ── Custom Duration ──
  customDurationContainer: { paddingHorizontal: 4, paddingBottom: 20 },
  customLabel: { fontSize: 14, color: '#64748b', marginBottom: 20, textAlign: 'center' },
  customInputRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 20, marginBottom: 24 },
  customInputBlock: { flex: 1, alignItems: 'center' },
  customInputLabel: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  customInputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', height: 56, width: '100%' },
  counterBtn: { width: 44, height: '100%', justifyContent: 'center', alignItems: 'center' },
  counterInput: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '700', color: '#0f172a' },
  customPreview: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, marginBottom: 24 },
  customPreviewText: { fontSize: 16, fontWeight: '700', color: '#2563eb' },
  customConfirmBtn: { backgroundColor: '#2563eb', height: 52, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  customConfirmText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
