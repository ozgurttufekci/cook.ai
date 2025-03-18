import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator, Alert, SectionList, Modal, Share, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GroceryItem {
  id: string;
  name: string;
  isChecked: boolean;
  category: string;
  imageUrl?: string;
}

const STORAGE_KEY = '@grocery_list';

const GROCERY_CATEGORIES = [
  'Produce',
  'Dairy',
  'Meat & Seafood',
  'Pantry',
  'Frozen',
  'Beverages',
  'Household',
  'Other'
];

// Updated mapping with image URLs
const GROCERY_CLASSIFICATIONS: Record<string, { category: string; imageUrl: string }> = {
  // Produce
  'apple': { category: 'Produce', imageUrl: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=100&h=100&fit=crop' },
  'banana': { category: 'Produce', imageUrl: 'https://images.unsplash.com/photo-1543218024-57a70143c369?w=100&h=100&fit=crop' },
  'orange': { category: 'Produce', imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=100&h=100&fit=crop' },
  'lettuce': { category: 'Produce', imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=100&h=100&fit=crop' },
  'spinach': { category: 'Produce', imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&h=100&fit=crop' },
  'carrot': { category: 'Produce', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=100&h=100&fit=crop' },
  'broccoli': { category: 'Produce', imageUrl: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=100&h=100&fit=crop' },
  'tomato': { category: 'Produce', imageUrl: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=100&h=100&fit=crop' },
  
  // Dairy
  'milk': { category: 'Dairy', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop' },
  'cheese': { category: 'Dairy', imageUrl: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100&h=100&fit=crop' },
  'yogurt': { category: 'Dairy', imageUrl: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=100&h=100&fit=crop' },
  'eggs': { category: 'Dairy', imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=100&h=100&fit=crop' },
  
  // Meat & Seafood
  'chicken': { category: 'Meat & Seafood', imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=100&h=100&fit=crop' },
  'beef': { category: 'Meat & Seafood', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=100&h=100&fit=crop' },
  'fish': { category: 'Meat & Seafood', imageUrl: 'https://images.unsplash.com/photo-1611171711912-e3f6b536f532?w=100&h=100&fit=crop' },
  'salmon': { category: 'Meat & Seafood', imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=100&h=100&fit=crop' },
  
  // Pantry
  'rice': { category: 'Pantry', imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=100&h=100&fit=crop' },
  'pasta': { category: 'Pantry', imageUrl: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=100&h=100&fit=crop' },
  'bread': { category: 'Pantry', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop' },
  'cereal': { category: 'Pantry', imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=100&h=100&fit=crop' },
  
  // Frozen
  'ice cream': { category: 'Frozen', imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=100&h=100&fit=crop' },
  'frozen pizza': { category: 'Frozen', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop' },
  
  // Beverages
  'water': { category: 'Beverages', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=100&h=100&fit=crop' },
  'coffee': { category: 'Beverages', imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop' },
  'tea': { category: 'Beverages', imageUrl: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=100&h=100&fit=crop' },
  
  // Household
  'paper towels': { category: 'Household', imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=100&h=100&fit=crop' },
  'toilet paper': { category: 'Household', imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=100&h=100&fit=crop' },
  'detergent': { category: 'Household', imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=100&h=100&fit=crop' },
};

type SortOption = 'aisle' | 'recipe';

export default function GroceryScreen() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('aisle');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Load items from storage when component mounts
  useEffect(() => {
    loadItems();
  }, []);

  // Save items to storage whenever they change
  useEffect(() => {
    saveItems();
  }, [items]);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const storedItems = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load grocery list. Please try again.');
      console.error('Error loading grocery list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveItems = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      Alert.alert('Error', 'Failed to save grocery list. Please try again.');
      console.error('Error saving grocery list:', error);
    }
  };

  const classifyItem = (itemName: string): { category: string; imageUrl?: string } => {
    const lowercaseName = itemName.toLowerCase();
    
    // Check for exact matches first
    for (const [keyword, classification] of Object.entries(GROCERY_CLASSIFICATIONS)) {
      if (lowercaseName.includes(keyword)) {
        return classification;
      }
    }
    
    // If no match found, return default
    return { category: 'Other' };
  };

  const addItem = () => {
    if (newItem.trim()) {
      const itemName = newItem.trim();
      const classification = classifyItem(itemName);
      
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          name: itemName,
          isChecked: false,
          category: classification.category,
          imageUrl: classification.imageUrl,
        },
      ]);
      setNewItem('');
    }
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearAll = () => {
    Alert.alert(
      'Clear All Items',
      'Are you sure you want to clear all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setItems([]),
        },
      ]
    );
  };

  const getSections = () => {
    if (sortBy === 'aisle') {
      // Group items by category
      const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, GroceryItem[]>);

      // Convert to array and sort
      return Object.entries(groupedItems)
        .map(([category, items]) => ({
          title: category,
          data: items.sort((a, b) => a.name.localeCompare(b.name))
        }))
        .sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Sort all items by name
      const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));
      return [{
        title: 'All Items',
        data: sortedItems
      }];
    }
  };

  const renderItem = ({ item }: { item: GroceryItem }) => (
    <View style={styles.itemContainer}>
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.itemImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.itemContent}>
        <Text style={[styles.itemText, item.isChecked && styles.checkedItemText]}>
          {item.name}
        </Text>
        {sortBy === 'aisle' && (
          <Text style={styles.categoryText}>{item.category}</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleItem(item.id)}
      >
        <Ionicons
          name={item.isChecked ? 'checkbox' : 'square-outline'}
          size={24}
          color={item.isChecked ? '#4CAF50' : '#757575'}
        />
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  const shareList = async () => {
    try {
      const sections = getSections();
      let shareText = 'Grocery List:\n\n';
      
      sections.forEach(section => {
        shareText += `${section.title}:\n`;
        section.data.forEach(item => {
          const checkbox = item.isChecked ? '✓' : '□';
          shareText += `${checkbox} ${item.name}\n`;
        });
        shareText += '\n';
      });

      await Share.share({
        message: shareText,
        title: 'My Grocery List'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share grocery list. Please try again.');
      console.error('Error sharing grocery list:', error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.title}>Grocery List</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={shareList} style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAll} style={styles.headerButton}>
            <Ionicons name="trash-outline" size={24} color="#FF5252" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sortContainer}>
        <TouchableOpacity 
          style={styles.sortDropdownContainer}
          onPress={() => setShowSortDropdown(true)}
        >
          <Text style={styles.sortLabel}>Sort by:</Text>
          <Text style={styles.sortValue}>
            {sortBy === 'aisle' ? 'Aisle' : 'Recipe'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#757575" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showSortDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortDropdown(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === 'aisle' && styles.selectedSortOption
              ]}
              onPress={() => {
                setSortBy('aisle');
                setShowSortDropdown(false);
              }}
            >
              <Text style={[
                styles.sortOptionText,
                sortBy === 'aisle' && styles.selectedSortOptionText
              ]}>
                Aisle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === 'recipe' && styles.selectedSortOption
              ]}
              onPress={() => {
                setSortBy('recipe');
                setShowSortDropdown(false);
              }}
            >
              <Text style={[
                styles.sortOptionText,
                sortBy === 'recipe' && styles.selectedSortOptionText
              ]}>
                Recipe
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {renderHeader()}
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        ) : (
          <SectionList
            sections={getSections()}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={item => item.id}
            style={styles.list}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newItem}
            onChangeText={setNewItem}
            placeholder="Add new item..."
            onSubmitEditing={addItem}
          />
          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Ionicons name="add-circle" size={44} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  sortContainer: {
    marginBottom: 8,
  },
  sortDropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  sortLabel: {
    fontSize: 14,
    color: '#757575',
    marginRight: 8,
  },
  sortValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxWidth: 300,
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedSortOption: {
    backgroundColor: '#4CAF50',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedSortOptionText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    marginRight: 8,
  },
  checkbox: {
    padding: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  checkedItemText: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  categoryText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    fontSize: 16,
  },
  addButton: {
    padding: 4,
  },
  sectionHeader: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    paddingLeft: 16,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
}); 