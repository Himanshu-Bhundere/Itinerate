import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator,
  StyleSheet, KeyboardAvoidingView, Platform, Modal, FlatList, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '@supabase/supabase-js';

// ─── City Coordinates Mapping ───
const CITY_COORDINATES: Record<string, {latitude: number, longitude: number}> = {
  'Kedarnath, Uttarakhand': { latitude: 30.7346, longitude: 79.0669 },
  'Manali, Himachal Pradesh': { latitude: 32.2396, longitude: 77.1887 },
  'Leh, Ladakh': { latitude: 34.1526, longitude: 77.5771 },
  'Goa': { latitude: 15.2993, longitude: 74.1240 },
  'Jaipur, Rajasthan': { latitude: 26.9124, longitude: 75.7873 },
  'Mumbai, Maharashtra': { latitude: 19.0760, longitude: 72.8777 },
  'Delhi': { latitude: 28.6139, longitude: 77.2090 },
  'New Delhi': { latitude: 28.6139, longitude: 77.2090 },
  'Bengaluru, Karnataka': { latitude: 12.9716, longitude: 77.5946 },
  'Chennai, Tamil Nadu': { latitude: 13.0827, longitude: 80.2707 },
  'Kolkata, West Bengal': { latitude: 22.5726, longitude: 88.3639 },
  'Hyderabad, Telangana': { latitude: 17.3850, longitude: 78.4867 },
  'Pune, Maharashtra': { latitude: 18.5204, longitude: 73.8567 },
  'Ahmedabad, Gujarat': { latitude: 23.0225, longitude: 72.5714 },
  'Srinagar, Jammu & Kashmir': { latitude: 34.0837, longitude: 74.7973 },
  'Rishikesh, Uttarakhand': { latitude: 30.0869, longitude: 78.2676 },
  'Udaipur, Rajasthan': { latitude: 24.5854, longitude: 73.7125 },
  'Varanasi, Uttar Pradesh': { latitude: 25.3176, longitude: 82.9739 },
  'Shimla, Himachal Pradesh': { latitude: 31.1048, longitude: 77.1734 },
  'Darjeeling, West Bengal': { latitude: 27.0360, longitude: 88.2627 },
  'Munnar, Kerala': { latitude: 10.0889, longitude: 77.0595 },
  'Alleppey, Kerala': { latitude: 9.4981, longitude: 76.3388 },
  'Andaman Islands': { latitude: 11.7401, longitude: 92.6586 },
};

import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../constants/tokens';

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

// ─── Presets ───
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

const BUDGET_PRESETS = [
  { label: '₹0 – ₹5,000', value: '0-5000' },
  { label: '₹5,000 – ₹10,000', value: '5000-10000' },
  { label: '₹10,000 – ₹20,000', value: '10000-20000' },
  { label: '₹20,000 – ₹50,000', value: '20000-50000' },
  { label: '₹50,000 – ₹1,00,000', value: '50000-100000' },
  { label: '₹1,00,000+', value: '100000+' },
];

const ACTIVITY_TYPES = [
  { id: 'sightseeing', label: 'Sightseeing', icon: 'camera-outline', color: Colors.blue500 },
  { id: 'food', label: 'Food & Dining', icon: 'restaurant-outline', color: Colors.orange500 },
  { id: 'adventure', label: 'Adventure', icon: 'flash-outline', color: Colors.danger },
  { id: 'transport', label: 'Transport', icon: 'car-outline', color: Colors.blue500 },
  { id: 'shopping', label: 'Shopping', icon: 'bag-outline', color: Colors.teal500 },
  { id: 'rest', label: 'Rest & Leisure', icon: 'bed-outline', color: Colors.teal500 },
];

const STAY_TYPES = ['Hotel', 'Hostel', 'Homestay', 'Camp', 'Tent', 'Resort', 'Airbnb', 'Other'];

const STEPS = ['Basic Info', 'Itinerary', 'Activities', 'Stay', 'Review'];

// ─── Time Slots for picker (30 min intervals) ───
const TIME_SLOTS: string[] = [];
for (let h = 5; h <= 23; h++) {
  for (const m of ['00', '30']) {
    const hh = h.toString().padStart(2, '0');
    TIME_SLOTS.push(`${hh}:${m}`);
  }
}

function formatTime(t: string): string {
  const [hStr, mStr] = t.split(':');
  const h = parseInt(hStr);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${mStr} ${ampm}`;
}

// ─── Types ───
type Activity = { id: string; title: string; time: string; type: string; notes: string };
type DayData = {
  title: string; description: string;
  activities: Activity[];
  stay_name: string; stay_type: string; stay_notes: string;
};

export default function CreateScreen() {
  const session = useAuthStore(state => state.session);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ─── Wizard State ───
  const [currentStep, setCurrentStep] = useState(0);
  const [planId, setPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ─── Step 1: Basic Info ───
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [durationLabel, setDurationLabel] = useState('');
  const [durationDays, setDurationDays] = useState(0);
  const [durationNights, setDurationNights] = useState(0);
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
  const allStyles = ['Backpacking', 'Adventure', 'Relaxation', 'Culture'];

  // ─── Step 2-4: Itinerary Data ───
  const [days, setDays] = useState<DayData[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showTimePickerModal, setShowTimePickerModal] = useState(false);
  const [editingDayIdx, setEditingDayIdx] = useState(0);
  const [newActivity, setNewActivity] = useState<Activity>({ id: '', title: '', time: '09:00', type: 'sightseeing', notes: '' });
  const [editingActivityIdx, setEditingActivityIdx] = useState<number | null>(null);

  // ─── Reset all form state ───
  const resetAll = () => {
    setCurrentStep(0);
    setPlanId(null);
    setTitle('');
    setLocation('');
    setLocationQuery('');
    setDurationLabel('');
    setDurationDays(0);
    setDurationNights(0);
    setCustomDays('');
    setCustomNights('');
    setBudgetLabel('');
    setBudgetValue('');
    setCustomBudget('');
    setTravelStyles(['Backpacking']);
    setDays([]);
    setExpandedDay(null);
  };

  // ─── Clear current step's data only ───
  const clearCurrentStepData = () => {
    if (currentStep === 1) {
      // Clear itinerary titles/descriptions
      const updated = days.map(d => ({ ...d, title: '', description: '' }));
      setDays(updated);
    } else if (currentStep === 2) {
      // Clear all activities
      const updated = days.map(d => ({ ...d, activities: [] }));
      setDays(updated);
    } else if (currentStep === 3) {
      // Clear all stay info
      const updated = days.map(d => ({ ...d, stay_name: '', stay_type: '', stay_notes: '' }));
      setDays(updated);
    }
  };

  // ─── Helpers ───
  const filteredCities = useMemo(() => {
    if (!locationQuery || locationQuery.length < 2) return [];
    const q = locationQuery.toLowerCase();
    return INDIAN_CITIES.filter(c => c.toLowerCase().includes(q)).slice(0, 8);
  }, [locationQuery]);

  const toggleStyle = (style: string) => {
    if (travelStyles.includes(style)) setTravelStyles(travelStyles.filter(s => s !== style));
    else setTravelStyles([...travelStyles, style]);
  };

  // ─── Duration Logic: Days & Nights auto-sync ───
  const updateDays = (newDays: number) => {
    const d = Math.max(1, Math.min(30, newDays));
    const n = Math.max(0, d - 1);
    setCustomDays(String(d));
    setCustomNights(String(n));
  };

  const updateNights = (newNights: number) => {
    const n = Math.max(0, Math.min(29, newNights));
    const d = n + 1;
    setCustomDays(String(d));
    setCustomNights(String(n));
  };

  const handleCustomDaysChange = (text: string) => {
    setCustomDays(text);
    const d = parseInt(text) || 0;
    if (d >= 1) {
      setCustomNights(String(Math.max(0, d - 1)));
    }
  };

  const handleCustomNightsChange = (text: string) => {
    setCustomNights(text);
    const n = parseInt(text) || 0;
    const currentDays = parseInt(customDays) || 0;
    if (n >= currentDays) {
      setCustomDays(String(n + 1));
    }
  };

  const selectCity = (city: string) => {
    setLocation(city);
    setLocationQuery(city);
    setShowLocationDropdown(false);
  };

  const selectDuration = (item: typeof DURATION_PRESETS[0]) => {
    setDurationLabel(item.label);
    setDurationDays(item.days);
    setDurationNights(item.nights);
    setShowDurationModal(false);
    setDurationMode('presets');
  };

  const confirmCustomDuration = () => {
    const d = parseInt(customDays) || 0;
    const n = parseInt(customNights) || 0;
    if (d <= 0) { Alert.alert('Invalid', 'Days must be at least 1'); return; }
    if (n >= d) { Alert.alert('Invalid', 'Nights cannot be more than or equal to days'); return; }
    setDurationLabel(`${d} Day${d > 1 ? 's' : ''} / ${n} Night${n !== 1 ? 's' : ''}`);
    setDurationDays(d);
    setDurationNights(n);
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
    if (val <= 0) { Alert.alert('Invalid', 'Please enter a valid budget'); return; }
    setBudgetLabel(`₹${val.toLocaleString('en-IN')}`);
    setBudgetValue(String(val));
    setShowBudgetModal(false);
  };

  // ─── Initialize day data when moving to Step 2 ───
  const initDays = () => {
    if (days.length === durationDays) return;
    const newDays: DayData[] = [];
    for (let i = 0; i < durationDays; i++) {
      if (days[i]) {
        newDays.push(days[i]);
      } else {
        newDays.push({
          title: i === 0 ? 'Arrival Day' : i === durationDays - 1 ? 'Departure Day' : `Day ${i + 1}`,
          description: '',
          activities: [],
          stay_name: '',
          stay_type: '',
          stay_notes: '',
        });
      }
    }
    setDays(newDays);
  };

  // ─── Activity Management ───
  const openAddActivity = (dayIdx: number) => {
    setEditingDayIdx(dayIdx);
    setEditingActivityIdx(null);
    setNewActivity({ id: Date.now().toString(), title: '', time: '09:00', type: 'sightseeing', notes: '' });
    setShowActivityModal(true);
  };

  const openEditActivity = (dayIdx: number, actIdx: number) => {
    setEditingDayIdx(dayIdx);
    setEditingActivityIdx(actIdx);
    setNewActivity({ ...days[dayIdx].activities[actIdx] });
    setShowActivityModal(true);
  };

  const saveActivity = () => {
    if (!newActivity.title.trim()) { Alert.alert('Missing', 'Activity title is required'); return; }
    if (!newActivity.time) { Alert.alert('Missing', 'Please select a time for this activity'); return; }

    // Check for duplicate time on the same day (skip if editing the same activity)
    const existingActivities = days[editingDayIdx].activities;
    const duplicate = existingActivities.find((act, idx) => {
      if (editingActivityIdx !== null && idx === editingActivityIdx) return false;
      return act.time === newActivity.time;
    });
    if (duplicate) {
      Alert.alert('Time Conflict', `There's already an activity at ${formatTime(newActivity.time)} — "${duplicate.title}". Please choose a different time.`);
      return;
    }

    const updated = [...days];
    if (editingActivityIdx !== null) {
      updated[editingDayIdx].activities[editingActivityIdx] = newActivity;
    } else {
      updated[editingDayIdx].activities.push(newActivity);
    }
    // Sort activities by time within the day
    updated[editingDayIdx].activities.sort((a, b) => a.time.localeCompare(b.time));
    setDays(updated);
    setShowActivityModal(false);
  };

  const deleteActivity = (dayIdx: number, actIdx: number) => {
    Alert.alert('Delete Activity', 'Are you sure you want to remove this activity?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: () => {
          const updated = [...days];
          updated[dayIdx].activities.splice(actIdx, 1);
          setDays(updated);
        }
      },
    ]);
  };

  const updateDayField = (dayIdx: number, field: keyof DayData, value: any) => {
    const updated = [...days];
    (updated[dayIdx] as any)[field] = value;
    setDays(updated);
  };

  // ─── X button: save draft and reset ───
  const handleClose = async () => {
    if (planId) {
      // Already saved as draft from step 1
      Alert.alert('Trip Saved', 'Your trip has been saved as a draft.');
    }
    resetAll();
  };

  // ─── Back button: clear current step data and go back ───
  const handleBack = () => {
    if (currentStep > 0) {
      clearCurrentStepData();
      setCurrentStep(currentStep - 1);
    }
  };

  // ─── Navigation ───
  async function handleNext() {
    if (currentStep === 0) {
      if (!title || !location || !durationDays) {
        Alert.alert('Missing Info', 'Please fill in Plan Title, Destination, and Duration.');
        return;
      }
      setLoading(true);
      try {
        const coords = CITY_COORDINATES[location] || { latitude: 20.5937, longitude: 78.9629 }; // Default to India center
        
        if (planId) {
          const { error } = await supabase.from('plans').update({
            title, location,
            latitude: coords.latitude,
            longitude: coords.longitude,
            duration_days: durationDays,
            duration_nights: durationNights,
            budget_level: budgetValue || null,
            category: travelStyles[0]?.toLowerCase() || 'general',
          }).eq('id', planId);
          if (error) { Alert.alert('Error', error.message); setLoading(false); return; }
        } else {
          const { data, error } = await supabase.from('plans').insert({
            title, location,
            latitude: coords.latitude,
            longitude: coords.longitude,
            duration_days: durationDays,
            duration_nights: durationNights,
            budget_level: budgetValue || null,
            category: travelStyles[0]?.toLowerCase() || 'general',
            visibility: 'private',
            status: 'draft',
            creator_id: session?.user?.id,
          }).select().single();
          if (error) { Alert.alert('Error', error.message); setLoading(false); return; }
          if (data) setPlanId(data.id);
        }
      } catch (e: any) {
        Alert.alert('Error', e.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      initDays();
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Validate itinerary: each day needs a title
      const emptyTitle = days.findIndex(d => !d.title.trim());
      if (emptyTitle >= 0) {
        Alert.alert('Missing Title', `Please add a title for Day ${emptyTitle + 1}.`);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!planId) return;
      setLoading(true);
      try {
        const { error: deleteError } = await supabase.from('itinerary_days').delete().eq('plan_id', planId);
        if (deleteError) { Alert.alert('Error deleting old days', deleteError.message); setLoading(false); return; }
        const rows = days.map((d, i) => ({
          plan_id: planId,
          day_number: i + 1,
          title: d.title,
          description: d.description,
          activities: d.activities,
          stay_name: d.stay_name,
          stay_type: d.stay_type,
          stay_notes: d.stay_notes,
        }));
        const { error } = await supabase.from('itinerary_days').insert(rows);
        if (error) { Alert.alert('Error saving itinerary', error.message); setLoading(false); return; }
      } catch (e: any) {
        Alert.alert('Error', e.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      handlePublish();
    }
  }

  async function handlePublish() {
    if (!planId) return;
    setLoading(true);
    const { error } = await supabase.from('plans').update({
      status: 'published',
      visibility: 'public',
    }).eq('id', planId);
    
    if (error) { 
      setLoading(false);
      Alert.alert('Error', error.message); 
      return; 
    }
    
    // Navigate first
    router.replace({ pathname: '/publish_success', params: { plan_id: planId, plan_title: title } });
    
    // Reset local state after navigation to prevent "addViewAt" crash in Fabric
    setTimeout(() => {
      setLoading(false);
      resetAll();
    }, 400);
  }

  // ────────────────────────────────────────
  // RENDER STEP CONTENT
  // ────────────────────────────────────────

  const renderBasicInfo = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
      {/* Hero */}
      <View style={s.hero}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <Text style={s.heroTitle}>Let's start with the basics ✨</Text>
          <Text style={s.heroSub}>Fill in a few details to build your perfect trip.</Text>
        </View>
        <View style={s.heroIllustration}>
          <Ionicons name="map-outline" size={48} color={Colors.blue400} />
          <View style={s.heroPinBadge}><Ionicons name="location" size={16} color={Colors.white} /></View>
        </View>
      </View>

      {/* Form Card */}
      <View style={s.card}>
        {/* Plan Title */}
        <Text style={s.label}>Plan Title</Text>
        <View style={s.inputRow}>
          <View style={[s.inputIcon, { backgroundColor: Colors.blue50 }]}>
            <Ionicons name="document-text-outline" size={20} color={Colors.blue500} />
          </View>
          <TextInput style={s.input} placeholder="Kedarnath Trek Adventure" placeholderTextColor={Colors.placeholder} value={title} onChangeText={setTitle} maxLength={80} />
          <Text style={s.charCount}>{title.length}/80</Text>
        </View>

        {/* Destination */}
        <Text style={s.label}>Destination</Text>
        <View style={{ position: 'relative', zIndex: 100 }}>
          <View style={s.inputRow}>
            <View style={[s.inputIcon, { backgroundColor: Colors.teal50 }]}>
              <Ionicons name="location-outline" size={20} color={Colors.teal500} />
            </View>
            <TextInput style={s.input} placeholder="Search destination..." placeholderTextColor={Colors.placeholder}
              value={locationQuery}
              onChangeText={(text) => { setLocationQuery(text); setLocation(text); setShowLocationDropdown(text.length >= 2); }}
              onFocus={() => { if (locationQuery.length >= 2) setShowLocationDropdown(true); }}
            />
            <Ionicons name="chevron-down" size={20} color={Colors.secondaryText} style={{ marginRight: 12 }} />
          </View>
          {showLocationDropdown && filteredCities.length > 0 && (
            <View style={s.autocompleteDropdown}>
              {filteredCities.map((city, idx) => (
                <TouchableOpacity key={idx} style={s.autocompleteItem} onPress={() => selectCity(city)}>
                  <Ionicons name="location" size={16} color={Colors.blue500} style={{ marginRight: 12 }} />
                  <Text style={s.autocompleteText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Duration */}
        <Text style={s.label}>Duration</Text>
        <TouchableOpacity style={s.inputRow} onPress={() => setShowDurationModal(true)}>
          <View style={[s.inputIcon, { backgroundColor: Colors.blue50 }]}>
            <Ionicons name="calendar-outline" size={20} color={Colors.blue500} />
          </View>
          <Text style={[s.inputPlaceholder, durationLabel && s.inputValue]}>{durationLabel || '4 Days / 3 Nights'}</Text>
          <Ionicons name="chevron-down" size={20} color={Colors.secondaryText} style={{ marginRight: 12 }} />
        </TouchableOpacity>

        {/* Budget */}
        <Text style={s.label}>Budget <Text style={{ color: Colors.placeholder, fontWeight: '400' }}>(per person)</Text></Text>
        <TouchableOpacity style={s.inputRow} onPress={() => setShowBudgetModal(true)}>
          <View style={[s.inputIcon, { backgroundColor: Colors.teal50 }]}>
            <Ionicons name="wallet-outline" size={20} color={Colors.teal500} />
          </View>
          <Text style={[s.inputPlaceholder, budgetLabel && s.inputValue]}>{budgetLabel || '₹8,000 - ₹10,000'}</Text>
          <Ionicons name="chevron-down" size={20} color={Colors.secondaryText} style={{ marginRight: 12 }} />
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
                  size={18} color={isActive ? Colors.orange500 : Colors.secondaryText} style={{ marginRight: 6 }}
                />
                <Text style={[s.stylePillText, isActive && s.stylePillTextActive]}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="bulb-outline" size={14} color={Colors.orange500} />
          <Text style={{ fontSize: 12, color: Colors.secondaryText, marginLeft: 6 }}>You can select multiple styles</Text>
        </View>
      </View>
    </ScrollView>
  );

  // ─── Step 2: Itinerary (title + description only, NO activities) ───
  const renderItinerary = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={s.hero}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <Text style={s.heroTitle}>Plan your days 📋</Text>
          <Text style={s.heroSub}>Give each day a title and describe what you'll do.</Text>
        </View>
        <View style={s.heroIllustration}>
          <Ionicons name="calendar-outline" size={48} color={Colors.blue500} />
        </View>
      </View>

      {days.map((day, idx) => (
        <TouchableOpacity key={idx} style={s.dayCard} onPress={() => setExpandedDay(expandedDay === idx ? null : idx)} activeOpacity={0.8}>
          <View style={s.dayCardHeader}>
            <View style={s.dayBadge}>
              <Text style={s.dayBadgeText}>Day {idx + 1}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <TextInput
                style={s.dayTitleInput}
                value={day.title}
                onChangeText={(t) => updateDayField(idx, 'title', t)}
                placeholder={`Day ${idx + 1} Title`}
                placeholderTextColor={Colors.placeholder}
              />
            </View>
            <Ionicons name={expandedDay === idx ? 'chevron-up' : 'chevron-down'} size={20} color={Colors.secondaryText} />
          </View>

          {expandedDay === idx && (
            <View style={s.dayCardExpanded}>
              <Text style={s.fieldLabel}>Description</Text>
              <TextInput
                style={s.textArea}
                value={day.description}
                onChangeText={(t) => updateDayField(idx, 'description', t)}
                placeholder="What's the plan for this day?"
                placeholderTextColor={Colors.placeholder}
                multiline
                numberOfLines={3}
              />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // ─── Step 3: Activities (with precise time) ───
  const renderActivities = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={s.hero}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <Text style={s.heroTitle}>Add activities 🎯</Text>
          <Text style={s.heroSub}>Fill in what you'll be doing each day — sightseeing, food, adventures.</Text>
        </View>
        <View style={[s.heroIllustration, { backgroundColor: Colors.blue50 }]}>
          <Ionicons name="compass-outline" size={48} color={Colors.orange500} />
        </View>
      </View>

      {days.map((day, idx) => {
        const totalActivities = day.activities.length;
        return (
          <View key={idx} style={s.activityDaySection}>
            <View style={s.activityDayHeader}>
              <View style={[s.dayBadge, { backgroundColor: Colors.blue50 }]}>
                <Text style={[s.dayBadgeText, { color: Colors.blue500 }]}>Day {idx + 1}</Text>
              </View>
              <Text style={s.activityDayTitle}>{day.title}</Text>
              <Text style={s.activityCount}>{totalActivities} {totalActivities === 1 ? 'activity' : 'activities'}</Text>
            </View>

            {day.activities.length === 0 ? (
              <View style={s.emptyActivities}>
                <Ionicons name="calendar-outline" size={24} color={Colors.disabledText} />
                <Text style={s.emptyText}>No activities yet</Text>
              </View>
            ) : (
              day.activities.map((act, aIdx) => {
                const typeInfo = ACTIVITY_TYPES.find(t => t.id === act.type);
                return (
                  <TouchableOpacity key={aIdx} style={s.activityListItem} onPress={() => openEditActivity(idx, aIdx)}>
                    <View style={s.activityTimeColumn}>
                      <Text style={s.activityTimeText}>{formatTime(act.time)}</Text>
                    </View>
                    <View style={s.activityTimeLine} />
                    <View style={[s.activityTypeIcon, { backgroundColor: (typeInfo?.color || Colors.placeholder) + '15' }]}>
                      <Ionicons name={(typeInfo?.icon || 'ellipse') as any} size={18} color={typeInfo?.color || Colors.placeholder} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.activityListTitle}>{act.title}</Text>
                      <Text style={s.activityListMeta}>{typeInfo?.label || act.type}</Text>
                      {act.notes ? <Text style={s.activityListNotes} numberOfLines={1}>{act.notes}</Text> : null}
                    </View>
                    <TouchableOpacity onPress={() => deleteActivity(idx, aIdx)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Ionicons name="trash-outline" size={16} color={Colors.danger} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })
            )}

            <TouchableOpacity style={s.addActivityBtn} onPress={() => openAddActivity(idx)}>
              <Ionicons name="add-circle-outline" size={18} color={Colors.blue500} />
              <Text style={s.addActivityText}>Add Activity</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );

  // ─── Step 4: Stay ───
  const renderStay = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={s.hero}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <Text style={s.heroTitle}>Where will you stay? 🏨</Text>
          <Text style={s.heroSub}>Add accommodation details for each night of your trip.</Text>
        </View>
        <View style={[s.heroIllustration, { backgroundColor: Colors.teal50 }]}>
          <Ionicons name="bed-outline" size={48} color={Colors.teal500} />
        </View>
      </View>

      {days.map((day, idx) => {
        if (idx >= durationNights) return null;
        return (
          <View key={idx} style={s.stayCard}>
            <View style={s.stayCardHeader}>
              <View style={[s.dayBadge, { backgroundColor: Colors.teal50 }]}>
                <Text style={[s.dayBadgeText, { color: Colors.teal500 }]}>Night {idx + 1}</Text>
              </View>
              <Text style={s.stayDayLabel}>After Day {idx + 1}</Text>
            </View>

            <Text style={s.fieldLabel}>Accommodation Name</Text>
            <View style={s.inputRow}>
              <View style={[s.inputIcon, { backgroundColor: Colors.teal50 }]}>
                <Ionicons name="business-outline" size={20} color={Colors.teal500} />
              </View>
              <TextInput style={s.input} placeholder="e.g., Mountain View Hostel" placeholderTextColor={Colors.placeholder}
                value={day.stay_name} onChangeText={(t) => updateDayField(idx, 'stay_name', t)}
              />
            </View>

            <Text style={s.fieldLabel}>Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {STAY_TYPES.map((type) => (
                <TouchableOpacity key={type}
                  style={[s.stayTypePill, day.stay_type === type && s.stayTypePillActive]}
                  onPress={() => updateDayField(idx, 'stay_type', type)}
                >
                  <Text style={[s.stayTypePillText, day.stay_type === type && s.stayTypePillTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={s.fieldLabel}>Notes <Text style={{ color: Colors.placeholder, fontWeight: '400' }}>(optional)</Text></Text>
            <TextInput style={s.textArea} placeholder="Booking reference, contact info, etc."
              placeholderTextColor={Colors.placeholder} multiline numberOfLines={2}
              value={day.stay_notes} onChangeText={(t) => updateDayField(idx, 'stay_notes', t)}
            />
          </View>
        );
      })}

      {durationNights === 0 && (
        <View style={s.emptyState}>
          <Ionicons name="sunny-outline" size={48} color={Colors.orange500} />
          <Text style={s.emptyStateTitle}>Day trip!</Text>
          <Text style={s.emptyStateText}>No overnight stays needed for a 1-day trip.</Text>
        </View>
      )}
    </ScrollView>
  );

  // ─── Step 5: Review ───
  const renderReview = () => (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
      <View style={s.hero}>
        <View style={{ flex: 1, paddingRight: 16 }}>
          <Text style={s.heroTitle}>Review & Publish 🚀</Text>
          <Text style={s.heroSub}>Make sure everything looks perfect before going live.</Text>
        </View>
        <View style={[s.heroIllustration, { backgroundColor: Colors.teal50 }]}>
          <Ionicons name="checkmark-circle-outline" size={48} color={Colors.teal500} />
        </View>
      </View>

      <View style={s.reviewCard}>
        <Text style={s.reviewCardTitle}>Trip Details</Text>
        <View style={s.reviewRow}>
          <Ionicons name="document-text-outline" size={18} color={Colors.blue500} />
          <Text style={s.reviewLabel}>Title</Text>
          <Text style={s.reviewValue}>{title}</Text>
        </View>
        <View style={s.reviewRow}>
          <Ionicons name="location-outline" size={18} color={Colors.teal500} />
          <Text style={s.reviewLabel}>Destination</Text>
          <Text style={s.reviewValue}>{location}</Text>
        </View>
        <View style={s.reviewRow}>
          <Ionicons name="calendar-outline" size={18} color={Colors.blue500} />
          <Text style={s.reviewLabel}>Duration</Text>
          <Text style={s.reviewValue}>{durationLabel}</Text>
        </View>
        <View style={s.reviewRow}>
          <Ionicons name="wallet-outline" size={18} color={Colors.teal500} />
          <Text style={s.reviewLabel}>Budget</Text>
          <Text style={s.reviewValue}>{budgetLabel || 'Not set'}</Text>
        </View>
        <View style={s.reviewRow}>
          <MaterialCommunityIcons name="bag-personal" size={18} color={Colors.orange500} />
          <Text style={s.reviewLabel}>Style</Text>
          <Text style={s.reviewValue}>{travelStyles.join(', ') || 'Not set'}</Text>
        </View>
      </View>

      {days.map((day, idx) => (
        <View key={idx} style={s.reviewDayCard}>
          <View style={s.reviewDayHeader}>
            <View style={s.dayBadge}><Text style={s.dayBadgeText}>Day {idx + 1}</Text></View>
            <Text style={s.reviewDayTitle}>{day.title}</Text>
          </View>
          {day.description ? <Text style={s.reviewDayDesc}>{day.description}</Text> : null}

          {day.activities.length > 0 && (
            <View style={s.reviewActivitiesSection}>
              <Text style={s.reviewSubhead}>Activities</Text>
              {day.activities.map((act, aIdx) => {
                const typeInfo = ACTIVITY_TYPES.find(t => t.id === act.type);
                return (
                  <View key={aIdx} style={s.reviewActivityRow}>
                    <Ionicons name={(typeInfo?.icon || 'ellipse') as any} size={14} color={typeInfo?.color || Colors.secondaryText} />
                    <Text style={s.reviewActivityText}>{formatTime(act.time)} — {act.title}</Text>
                  </View>
                );
              })}
            </View>
          )}

          {idx < durationNights && day.stay_name ? (
            <View style={s.reviewStaySection}>
              <Text style={s.reviewSubhead}>Stay</Text>
              <View style={s.reviewActivityRow}>
                <Ionicons name="bed-outline" size={14} color={Colors.teal500} />
                <Text style={s.reviewActivityText}>{day.stay_name}{day.stay_type ? ` (${day.stay_type})` : ''}</Text>
              </View>
            </View>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );

  // ────────────────────────────────────────
  // MAIN RENDER
  // ────────────────────────────────────────

  const stepContent = [renderBasicInfo, renderItinerary, renderActivities, renderStay, renderReview];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header — Only back arrow on Step 0, title + X on all */}
        <View style={s.header}>
          {currentStep === 0 ? (
            <TouchableOpacity style={s.headerIconBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={Colors.primaryText} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
          <Text style={s.headerTitle}>{currentStep === 4 ? 'Review Trip' : 'Create New Itinerary'}</Text>
          <TouchableOpacity style={s.headerIconBtn} onPress={handleClose}>
            <Ionicons name="close" size={24} color={Colors.primaryText} />
          </TouchableOpacity>
        </View>

        {/* Stepper */}
        <View style={s.stepper}>
          {STEPS.map((step, idx) => (
            <React.Fragment key={step}>
              {idx > 0 && <View style={[s.stepLine, idx <= currentStep && s.stepLineActive]} />}
              <View style={s.stepItem}>
                <View style={[s.stepCircle, idx < currentStep && s.stepCircleCompleted, idx === currentStep && s.stepCircleActive]}>
                  {idx < currentStep ? (
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  ) : (
                    <Text style={[s.stepNum, idx === currentStep && s.stepNumActive]}>{idx + 1}</Text>
                  )}
                </View>
                <Text style={[s.stepLabel, idx === currentStep && s.stepLabelActive]}>{step}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Step Content */}
        {stepContent[currentStep]()}

        {/* Bottom Actions */}
        <View style={[s.bottomActions, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          {/* Next / Publish button */}
          <TouchableOpacity onPress={handleNext} disabled={loading}>
            <View style={[s.nextBtn, currentStep === 4 && { backgroundColor: Colors.teal500 }]}>
              {loading ? <ActivityIndicator color={Colors.white} /> : (
                <>
                  <Text style={s.nextBtnText}>{currentStep === 4 ? 'Publish Trip' : 'Next'}</Text>
                  <Ionicons name={currentStep === 4 ? 'rocket-outline' : 'arrow-forward'} size={20} color={Colors.white} style={{ position: 'absolute', right: 24 }} />
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Back button below Next for steps 1-4 */}
          {currentStep > 0 && (
            <TouchableOpacity style={s.backBtn} onPress={handleBack}>
              <Ionicons name="arrow-back" size={18} color={Colors.secondaryText} style={{ marginRight: 8 }} />
              <Text style={s.backBtnText}>Back</Text>
            </TouchableOpacity>
          )}

          {/* Save Draft on Step 0 */}
          {currentStep === 0 && (
            <TouchableOpacity style={s.draftBtn}>
              <Ionicons name="bookmark-outline" size={18} color={Colors.blue500} style={{ marginRight: 8 }} />
              <Text style={s.draftBtnText}>Save Draft</Text>
            </TouchableOpacity>
          )}
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
                <Ionicons name="close" size={24} color={Colors.primaryText} />
              </TouchableOpacity>
            </View>

            <View style={s.modalTabs}>
              <TouchableOpacity style={[s.modalTab, durationMode === 'presets' && s.modalTabActive]} onPress={() => setDurationMode('presets')}>
                <Ionicons name="list-outline" size={16} color={durationMode === 'presets' ? Colors.blue500 : Colors.secondaryText} style={{ marginRight: 6 }} />
                <Text style={[s.modalTabText, durationMode === 'presets' && s.modalTabTextActive]}>Presets</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalTab, durationMode === 'custom' && s.modalTabActive]} onPress={() => setDurationMode('custom')}>
                <Ionicons name="create-outline" size={16} color={durationMode === 'custom' ? Colors.blue500 : Colors.secondaryText} style={{ marginRight: 6 }} />
                <Text style={[s.modalTabText, durationMode === 'custom' && s.modalTabTextActive]}>Custom</Text>
              </TouchableOpacity>
            </View>

            {durationMode === 'presets' ? (
              <FlatList
                data={DURATION_PRESETS}
                keyExtractor={(item) => item.label}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity style={[s.modalOption, durationLabel === item.label && s.modalOptionSelected]} onPress={() => selectDuration(item)}>
                    <View style={[s.modalOptionIcon, { backgroundColor: Colors.blue50 }]}>
                      <Ionicons name="calendar" size={18} color={Colors.blue500} />
                    </View>
                    <Text style={[s.modalOptionText, durationLabel === item.label && s.modalOptionTextSelected]}>{item.label}</Text>
                    {durationLabel === item.label && <Ionicons name="checkmark-circle" size={22} color={Colors.blue500} />}
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
                      <TouchableOpacity style={s.counterBtn} onPress={() => updateDays((parseInt(customDays) || 1) - 1)}>
                        <Ionicons name="remove" size={20} color={Colors.blue500} />
                      </TouchableOpacity>
                      <TextInput style={s.counterInput} value={customDays} onChangeText={handleCustomDaysChange}
                        keyboardType="number-pad" placeholder="0" placeholderTextColor={Colors.placeholder} maxLength={2} />
                      <TouchableOpacity style={s.counterBtn} onPress={() => updateDays((parseInt(customDays) || 0) + 1)}>
                        <Ionicons name="add" size={20} color={Colors.blue500} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={s.customInputBlock}>
                    <Text style={s.customInputLabel}>Nights</Text>
                    <View style={s.customInputBox}>
                      <TouchableOpacity style={s.counterBtn} onPress={() => updateNights((parseInt(customNights) || 1) - 1)}>
                        <Ionicons name="remove" size={20} color={Colors.blue500} />
                      </TouchableOpacity>
                      <TextInput style={s.counterInput} value={customNights} onChangeText={handleCustomNightsChange}
                        keyboardType="number-pad" placeholder="0" placeholderTextColor={Colors.placeholder} maxLength={2} />
                      <TouchableOpacity style={s.counterBtn} onPress={() => updateNights((parseInt(customNights) || 0) + 1)}>
                        <Ionicons name="add" size={20} color={Colors.blue500} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {(parseInt(customDays) > 0) && (
                  <View style={s.customPreview}>
                    <Ionicons name="time-outline" size={18} color={Colors.blue500} style={{ marginRight: 8 }} />
                    <Text style={s.customPreviewText}>
                      {customDays || '0'} Day{(parseInt(customDays) || 0) !== 1 ? 's' : ''} / {customNights || '0'} Night{(parseInt(customNights) || 0) !== 1 ? 's' : ''}
                    </Text>
                  </View>
                )}

                <TouchableOpacity style={s.customConfirmBtn} onPress={confirmCustomDuration}>
                  <Text style={s.customConfirmText}>Confirm Duration</Text>
                  <Ionicons name="checkmark" size={20} color={Colors.white} />
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
                <Ionicons name="close" size={24} color={Colors.primaryText} />
              </TouchableOpacity>
            </View>

            <View style={s.modalTabs}>
              <TouchableOpacity style={[s.modalTab, budgetMode === 'presets' && s.modalTabActive]} onPress={() => setBudgetMode('presets')}>
                <Ionicons name="list-outline" size={16} color={budgetMode === 'presets' ? Colors.blue500 : Colors.secondaryText} style={{ marginRight: 6 }} />
                <Text style={[s.modalTabText, budgetMode === 'presets' && s.modalTabTextActive]}>Presets</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalTab, budgetMode === 'custom' && s.modalTabActive]} onPress={() => setBudgetMode('custom')}>
                <Ionicons name="create-outline" size={16} color={budgetMode === 'custom' ? Colors.blue500 : Colors.secondaryText} style={{ marginRight: 6 }} />
                <Text style={[s.modalTabText, budgetMode === 'custom' && s.modalTabTextActive]}>Custom</Text>
              </TouchableOpacity>
            </View>

            {budgetMode === 'presets' ? (
              <FlatList
                data={BUDGET_PRESETS}
                keyExtractor={(item) => item.value}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity style={[s.modalOption, budgetLabel === item.label && s.modalOptionSelected]} onPress={() => selectBudget(item)}>
                    <View style={[s.modalOptionIcon, { backgroundColor: Colors.teal50 }]}>
                      <Ionicons name="wallet" size={18} color={Colors.teal500} />
                    </View>
                    <Text style={[s.modalOptionText, budgetLabel === item.label && s.modalOptionTextSelected]}>{item.label}</Text>
                    {budgetLabel === item.label && <Ionicons name="checkmark-circle" size={22} color={Colors.blue500} />}
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={s.customDurationContainer}>
                <Text style={s.customLabel}>Enter your budget per person</Text>
                <View style={[s.inputRow, { marginBottom: 24 }]}>
                  <View style={[s.inputIcon, { backgroundColor: Colors.teal50 }]}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.teal500 }}>₹</Text>
                  </View>
                  <TextInput style={s.input} placeholder="Enter amount" placeholderTextColor={Colors.placeholder}
                    value={customBudget} onChangeText={setCustomBudget} keyboardType="number-pad" />
                </View>
                {(parseInt(customBudget) > 0) && (
                  <View style={s.customPreview}>
                    <Ionicons name="wallet-outline" size={18} color={Colors.teal500} style={{ marginRight: 8 }} />
                    <Text style={s.customPreviewText}>₹{parseInt(customBudget).toLocaleString('en-IN')} per person</Text>
                  </View>
                )}
                <TouchableOpacity style={[s.customConfirmBtn, { backgroundColor: Colors.teal500 }]} onPress={confirmCustomBudget}>
                  <Text style={s.customConfirmText}>Confirm Budget</Text>
                  <Ionicons name="checkmark" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ──── Activity Modal ──── */}
      <Modal visible={showActivityModal} transparent animationType="slide" onRequestClose={() => setShowActivityModal(false)}>
        <View style={s.modalOverlay}>
          <View style={[s.modalSheet, { maxHeight: height * 0.85 }]}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{editingActivityIdx !== null ? 'Edit Activity' : 'Add Activity'}</Text>
              <TouchableOpacity onPress={() => setShowActivityModal(false)}>
                <Ionicons name="close" size={24} color={Colors.primaryText} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {/* Activity Title */}
              <Text style={s.fieldLabel}>Activity Title *</Text>
              <View style={s.inputRow}>
                <View style={[s.inputIcon, { backgroundColor: Colors.blue50 }]}>
                  <Ionicons name="flag-outline" size={20} color={Colors.blue500} />
                </View>
                <TextInput style={s.input} placeholder="e.g., Visit Kedarnath Temple"
                  placeholderTextColor={Colors.placeholder}
                  value={newActivity.title} onChangeText={(t) => setNewActivity({ ...newActivity, title: t })} />
              </View>

              {/* Time Picker */}
              <Text style={s.fieldLabel}>Time *</Text>
              <TouchableOpacity style={s.inputRow} onPress={() => setShowTimePickerModal(true)}>
                <View style={[s.inputIcon, { backgroundColor: Colors.blue50 }]}>
                  <Ionicons name="time-outline" size={20} color={Colors.orange500} />
                </View>
                <Text style={[s.inputPlaceholder, newActivity.time && s.inputValue]}>
                  {newActivity.time ? formatTime(newActivity.time) : 'Select time'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={Colors.secondaryText} style={{ marginRight: 12 }} />
              </TouchableOpacity>

              {/* Activity Type */}
              <Text style={s.fieldLabel}>Activity Type</Text>
              <View style={s.typeGrid}>
                {ACTIVITY_TYPES.map((type) => (
                  <TouchableOpacity key={type.id}
                    style={[s.typeCard, newActivity.type === type.id && { borderColor: type.color, backgroundColor: type.color + '10' }]}
                    onPress={() => setNewActivity({ ...newActivity, type: type.id })}
                  >
                    <Ionicons name={type.icon as any} size={20} color={type.color} />
                    <Text style={[s.typeCardText, newActivity.type === type.id && { color: type.color, fontWeight: '700' }]}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Notes */}
              <Text style={s.fieldLabel}>Notes <Text style={{ color: Colors.placeholder, fontWeight: '400' }}>(optional)</Text></Text>
              <TextInput style={s.textArea} placeholder="Any tips or details..."
                placeholderTextColor={Colors.placeholder} multiline numberOfLines={3}
                value={newActivity.notes} onChangeText={(t) => setNewActivity({ ...newActivity, notes: t })} />

              <TouchableOpacity style={[s.customConfirmBtn, { marginTop: 8, marginBottom: 32 }]} onPress={saveActivity}>
                <Text style={s.customConfirmText}>{editingActivityIdx !== null ? 'Save Changes' : 'Add Activity'}</Text>
                <Ionicons name="checkmark" size={20} color={Colors.white} />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ──── Time Picker Modal ──── */}
      <Modal visible={showTimePickerModal} transparent animationType="slide" onRequestClose={() => setShowTimePickerModal(false)}>
        <View style={s.modalOverlay}>
          <View style={[s.modalSheet, { maxHeight: height * 0.6 }]}>
            <View style={s.modalHandle} />
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Select Time</Text>
              <TouchableOpacity onPress={() => setShowTimePickerModal(false)}>
                <Ionicons name="close" size={24} color={Colors.primaryText} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={TIME_SLOTS}
              keyExtractor={(item) => item}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => {
                const isSelected = newActivity.time === item;
                // Check if this time is already taken by another activity on the same day
                const isTaken = days[editingDayIdx]?.activities.some((act, idx) => {
                  if (editingActivityIdx !== null && idx === editingActivityIdx) return false;
                  return act.time === item;
                });
                return (
                  <TouchableOpacity
                    style={[s.modalOption, isSelected && s.modalOptionSelected, isTaken && { opacity: 0.4 }]}
                    onPress={() => {
                      if (isTaken) {
                        Alert.alert('Time Taken', 'This time slot already has an activity.');
                        return;
                      }
                      setNewActivity({ ...newActivity, time: item });
                      setShowTimePickerModal(false);
                    }}
                  >
                    <View style={[s.modalOptionIcon, { backgroundColor: Colors.blue50 }]}>
                      <Ionicons name="time" size={18} color={Colors.orange500} />
                    </View>
                    <Text style={[s.modalOptionText, isSelected && s.modalOptionTextSelected]}>
                      {formatTime(item)}
                      {isTaken && ' (taken)'}
                    </Text>
                    {isSelected && <Ionicons name="checkmark-circle" size={22} color={Colors.blue500} />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ────────────────────────────────────────
// STYLES
// ────────────────────────────────────────

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  flex: { flex: 1, backgroundColor: Colors.surface },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: Colors.white },
  headerIconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.divider, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.primaryText },

  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: Colors.white },
  stepItem: { alignItems: 'center' },
  stepCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: Colors.disabledText, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white, marginBottom: 4 },
  stepCircleActive: { backgroundColor: Colors.blue500, borderColor: Colors.blue500 },
  stepCircleCompleted: { backgroundColor: Colors.teal500, borderColor: Colors.teal500 },
  stepNum: { fontSize: 12, fontWeight: '600', color: Colors.placeholder },
  stepNumActive: { color: Colors.white, fontWeight: '700' },
  stepLabel: { fontSize: 10, color: Colors.placeholder, fontWeight: '500' },
  stepLabelActive: { color: Colors.blue500, fontWeight: '600' },
  stepLine: { flex: 1, height: 1, backgroundColor: Colors.divider, marginHorizontal: 8, marginBottom: 16 },
  stepLineActive: { backgroundColor: Colors.teal500 },

  scrollContent: { padding: 20, paddingBottom: 180 },

  hero: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: Colors.primaryText, marginBottom: 8, lineHeight: 30 },
  heroSub: { fontSize: 14, color: Colors.secondaryText, lineHeight: 20 },
  heroIllustration: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center' },
  heroPinBadge: { position: 'absolute', top: -5, right: -5, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.blue400, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.surface },

  card: { backgroundColor: Colors.white, borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },

  label: { fontSize: 14, fontWeight: '600', color: Colors.primaryText, marginBottom: 8, marginTop: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.secondaryText, marginBottom: 8, marginTop: 4 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.divider, borderRadius: 16, height: 56, marginBottom: 16 },
  inputIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: Colors.primaryText },
  charCount: { fontSize: 12, color: Colors.placeholder, marginRight: 16 },
  inputPlaceholder: { flex: 1, fontSize: 15, color: Colors.placeholder },
  inputValue: { color: Colors.primaryText },

  autocompleteDropdown: { position: 'absolute', top: 58, left: 0, right: 0, backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: Colors.divider, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10, zIndex: 1000, maxHeight: 280 },
  autocompleteItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  autocompleteText: { fontSize: 14, color: Colors.primaryText, fontWeight: '500' },

  stylePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: Colors.divider, marginRight: 12 },
  stylePillActive: { borderColor: Colors.orange500, backgroundColor: '#fff7ed' },
  stylePillText: { fontSize: 13, fontWeight: '600', color: Colors.secondaryText },
  stylePillTextActive: { color: Colors.orange500 },

  textArea: { backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: Colors.divider, padding: 16, fontSize: 14, color: Colors.primaryText, minHeight: 80, textAlignVertical: 'top', marginBottom: 16 },

  // ── Day Cards ──
  dayCard: { backgroundColor: Colors.white, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.divider, overflow: 'hidden' },
  dayCardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  dayBadge: { backgroundColor: Colors.primaryText, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  dayBadgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  dayTitleInput: { fontSize: 15, fontWeight: '600', color: Colors.primaryText, padding: 0 },
  dayCardExpanded: { paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },

  // ── Activities ──
  addActivityBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#bfdbfe', borderStyle: 'dashed', marginTop: 4 },
  addActivityText: { fontSize: 13, fontWeight: '600', color: Colors.blue500, marginLeft: 6 },

  activityDaySection: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.divider },
  activityDayHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  activityDayTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.primaryText, marginLeft: 10 },
  activityCount: { fontSize: 12, color: Colors.secondaryText },
  emptyActivities: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { fontSize: 13, color: Colors.placeholder, marginTop: 8 },
  activityListItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginBottom: 4 },
  activityTimeColumn: { width: 60, alignItems: 'flex-end', paddingRight: 8 },
  activityTimeText: { fontSize: 11, fontWeight: '700', color: Colors.blue500 },
  activityTimeLine: { width: 1, height: 32, backgroundColor: Colors.divider, marginRight: 10 },
  activityTypeIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  activityListTitle: { fontSize: 14, fontWeight: '600', color: Colors.primaryText },
  activityListMeta: { fontSize: 12, color: Colors.secondaryText, marginTop: 2 },
  activityListNotes: { fontSize: 12, color: Colors.placeholder, marginTop: 2 },

  // ── Activity Modal ──
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeCard: { width: (width - 60) / 3 - 6, alignItems: 'center', paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: Colors.divider, backgroundColor: Colors.white },
  typeCardText: { fontSize: 11, fontWeight: '500', color: Colors.secondaryText, marginTop: 6, textAlign: 'center' },

  // ── Stay Cards ──
  stayCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.divider },
  stayCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  stayDayLabel: { fontSize: 13, color: Colors.secondaryText, marginLeft: 10 },
  stayTypePill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: Colors.divider, marginRight: 8, backgroundColor: Colors.white },
  stayTypePillActive: { borderColor: Colors.teal500, backgroundColor: '#fdf2f8' },
  stayTypePillText: { fontSize: 13, fontWeight: '600', color: Colors.secondaryText },
  stayTypePillTextActive: { color: Colors.teal500 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyStateTitle: { fontSize: 20, fontWeight: '700', color: Colors.primaryText, marginTop: 16 },
  emptyStateText: { fontSize: 14, color: Colors.secondaryText, marginTop: 8 },

  // ── Review ──
  reviewCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.divider },
  reviewCardTitle: { fontSize: 16, fontWeight: '700', color: Colors.primaryText, marginBottom: 16 },
  reviewRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.surface },
  reviewLabel: { fontSize: 13, color: Colors.secondaryText, marginLeft: 10, width: 90 },
  reviewValue: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.primaryText },
  reviewDayCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.divider },
  reviewDayHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  reviewDayTitle: { fontSize: 15, fontWeight: '600', color: Colors.primaryText, marginLeft: 10 },
  reviewDayDesc: { fontSize: 13, color: Colors.secondaryText, marginBottom: 8, lineHeight: 18 },
  reviewActivitiesSection: { marginTop: 8 },
  reviewStaySection: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  reviewSubhead: { fontSize: 12, fontWeight: '700', color: Colors.placeholder, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  reviewActivityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  reviewActivityText: { fontSize: 13, color: Colors.primaryText, marginLeft: 8 },

  // ── Bottom Actions ──
  bottomActions: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  nextBtn: { backgroundColor: Colors.blue500, height: 52, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
  backBtn: { height: 48, borderRadius: 16, borderWidth: 1, borderColor: Colors.divider, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white, marginBottom: 4 },
  backBtnText: { fontSize: 15, fontWeight: '600', color: Colors.secondaryText },
  draftBtn: { height: 48, borderRadius: 16, borderWidth: 1, borderColor: Colors.divider, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white },
  draftBtnText: { fontSize: 15, fontWeight: '600', color: Colors.blue500 },

  // ── Modal Styles ──
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: Colors.white, borderTopLeftRadius: 32, borderTopRightRadius: 32, maxHeight: height * 0.7, paddingHorizontal: 20, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: Colors.disabledText, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.primaryText },

  modalTabs: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 12, padding: 4, marginBottom: 20 },
  modalTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8 },
  modalTabActive: { backgroundColor: Colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  modalTabText: { fontSize: 14, fontWeight: '600', color: Colors.secondaryText },
  modalTabTextActive: { color: Colors.blue500 },

  modalOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 16, marginBottom: 8 },
  modalOptionSelected: { backgroundColor: Colors.blue50, borderWidth: 1, borderColor: '#bfdbfe' },
  modalOptionIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  modalOptionText: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.primaryText },
  modalOptionTextSelected: { fontWeight: '700', color: Colors.blue500 },

  customDurationContainer: { paddingHorizontal: 4, paddingBottom: 20 },
  customLabel: { fontSize: 14, color: Colors.secondaryText, marginBottom: 20, textAlign: 'center' },
  customInputRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 20, marginBottom: 12 },
  customInputBlock: { flex: 1, alignItems: 'center' },
  customInputLabel: { fontSize: 14, fontWeight: '700', color: Colors.primaryText, marginBottom: 12 },
  customInputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 1, borderColor: Colors.divider, height: 56, width: '100%' },
  counterBtn: { width: 44, height: '100%' as any, justifyContent: 'center', alignItems: 'center' },
  counterInput: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '700', color: Colors.primaryText },
  customPreview: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.blue50, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, marginBottom: 24 },
  customPreviewText: { fontSize: 16, fontWeight: '700', color: Colors.blue500 },
  customConfirmBtn: { backgroundColor: Colors.blue500, height: 52, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  customConfirmText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});
