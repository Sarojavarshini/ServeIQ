import { MenuItem } from '../types';

export const menuItems: MenuItem[] = [
  // Tiffin
  { id: '1', name: 'Ghee Roast Dosa', price: 120, description: 'Crispy dosa roasted in pure ghee, served with 3 chutneys and sambar.', calories: 350, tags: ['Vegetarian', 'Popular'], category: 'Tiffin' },
  { id: '2', name: 'Medu Vada', price: 60, description: 'Deep-fried lentil donuts, crispy outside and fluffy inside.', calories: 250, tags: ['Vegetarian', 'Fried'], category: 'Tiffin' },
  { id: '5', name: 'Mini Tiffin', price: 150, description: 'A delightful combo of mini idlis, pongal, sweet, and a mini dosa.', calories: 600, tags: ['Vegetarian', 'Heavy', 'Combo'], category: 'Tiffin' },
  { id: '6', name: 'Idli Sambar', price: 50, description: 'Soft steamed rice cakes served with piping hot lentil stew.', calories: 150, tags: ['Vegetarian', 'Healthy'], category: 'Tiffin' },
  { id: '7', name: 'Masala Dosa', price: 90, description: 'Classic dosa stuffed with spiced potato filling.', calories: 320, tags: ['Vegetarian', 'Popular'], category: 'Tiffin' },
  { id: '8', name: 'Onion Rava Dosa', price: 110, description: 'Crispy semolina crepe with roasted onions and green chilies.', calories: 280, tags: ['Vegetarian'], category: 'Tiffin' },
  { id: '9', name: 'Ven Pongal', price: 80, description: 'Comforting rice and lentil dish tempered with black pepper, cumin, and ghee.', calories: 400, tags: ['Vegetarian', 'Comfort Food'], category: 'Tiffin' },
  { id: '10', name: 'Poori Masala', price: 100, description: 'Fluffy deep-fried Indian bread served with potato curry.', calories: 450, tags: ['Vegetarian', 'Fried'], category: 'Tiffin' },
  { id: '11', name: 'Upma', price: 60, description: 'Savory semolina porridge cooked with vegetables and tempered spices.', calories: 220, tags: ['Vegetarian', 'Healthy'], category: 'Tiffin' },
  { id: '12', name: 'Pesarattu', price: 95, description: 'Nutritious green gram dosa, a specialty from Andhra Pradesh.', calories: 200, tags: ['Vegetarian', 'High Protein'], category: 'Tiffin' },
  { id: '13', name: 'Onion Uttapam', price: 100, description: 'Thick, soft pancake topped with finely chopped onions and tomatoes.', calories: 300, tags: ['Vegetarian'], category: 'Tiffin' },

  // Lunch
  { id: '14', name: 'South Indian Meals', price: 180, description: 'Traditional thali with rice, sambar, rasam, poriyal, kootu, curd, and papad.', calories: 750, tags: ['Vegetarian', 'Heavy'], category: 'Lunch' },
  { id: '15', name: 'Hyderabadi Chicken Biryani', price: 280, description: 'Aromatic basmati rice cooked with tender chicken and authentic spices.', calories: 850, tags: ['Non-Veg', 'Popular', 'Spicy'], category: 'Lunch' },
  { id: '16', name: 'Mutton Biryani', price: 350, description: 'Rich and flavorful biryani made with succulent pieces of mutton.', calories: 950, tags: ['Non-Veg', 'Heavy'], category: 'Lunch' },
  { id: '17', name: 'Veg Dum Biryani', price: 220, description: 'Fragrant rice cooked with mixed vegetables and biryani spices.', calories: 600, tags: ['Vegetarian'], category: 'Lunch' },
  { id: '18', name: 'Lemon Rice', price: 90, description: 'Tangy and flavorful rice tempered with mustard seeds, peanuts, and curry leaves.', calories: 350, tags: ['Vegetarian', 'Light'], category: 'Lunch' },
  { id: '19', name: 'Tamarind Rice', price: 100, description: 'Traditional Puliyogare with a perfect balance of tanginess and spice.', calories: 380, tags: ['Vegetarian', 'Spicy'], category: 'Lunch' },
  { id: '20', name: 'Curd Rice', price: 80, description: 'Soothing yogurt rice tempered with mustard seeds and pomegranate.', calories: 250, tags: ['Vegetarian', 'Healthy', 'Cooling'], category: 'Lunch' },
  { id: '21', name: 'Bisi Bele Bath', price: 130, description: 'Spicy, wholesome meal of rice, lentils, and vegetables cooked together.', calories: 450, tags: ['Vegetarian', 'Comfort Food'], category: 'Lunch' },
  { id: '22', name: 'Chettinad Chicken Curry', price: 260, description: 'Fiery chicken curry made with freshly ground Chettinad spices.', calories: 550, tags: ['Non-Veg', 'Spicy'], category: 'Lunch' },
  { id: '23', name: 'Malabar Fish Curry', price: 320, description: 'Tangy and spicy fish curry cooked in coconut milk and kokum.', calories: 480, tags: ['Non-Veg', 'Seafood'], category: 'Lunch' },
  { id: '24', name: 'Paneer Butter Masala', price: 240, description: 'Soft paneer cubes in a rich, creamy tomato gravy.', calories: 500, tags: ['Vegetarian', 'Rich'], category: 'Lunch' },
  { id: '25', name: 'Dal Makhani', price: 200, description: 'Slow-cooked black lentils and kidney beans enriched with butter and cream.', calories: 450, tags: ['Vegetarian', 'Rich'], category: 'Lunch' },
  { id: '26', name: 'Ghee Rice', price: 140, description: 'Aromatic jeera samba rice cooked with generous amounts of ghee and cashews.', calories: 500, tags: ['Vegetarian'], category: 'Lunch' },
  { id: '27', name: 'Kerala Parotta', price: 40, description: 'Flaky, layered flatbread made from refined wheat flour.', calories: 300, tags: ['Vegetarian', 'Bread'], category: 'Lunch' },
  { id: '28', name: 'Chapati', price: 25, description: 'Soft whole wheat flatbread.', calories: 100, tags: ['Vegetarian', 'Healthy', 'Bread'], category: 'Lunch' },

  // Starters
  { id: '3', name: 'Chicken 65', price: 220, description: 'Spicy, deep-fried chicken bites flavored with curry leaves and chilies.', calories: 450, tags: ['Non-Veg', 'Spicy', 'Fried'], category: 'Starters' },
  { id: '29', name: 'Gobi Manchurian', price: 180, description: 'Crispy cauliflower florets tossed in a sweet and spicy Indo-Chinese sauce.', calories: 380, tags: ['Vegetarian', 'Indo-Chinese'], category: 'Starters' },
  { id: '30', name: 'Chilli Paneer', price: 210, description: 'Batter-fried paneer cubes tossed with bell peppers, onions, and spicy sauces.', calories: 420, tags: ['Vegetarian', 'Indo-Chinese'], category: 'Starters' },
  { id: '31', name: 'Apollo Fish', price: 290, description: 'Boneless fish fillets marinated in spicy yogurt and deep-fried.', calories: 350, tags: ['Non-Veg', 'Seafood', 'Spicy'], category: 'Starters' },
  { id: '32', name: 'Mutton Sukka', price: 340, description: 'Tender mutton pieces dry roasted with a blend of aromatic spices.', calories: 500, tags: ['Non-Veg', 'Spicy'], category: 'Starters' },
  { id: '33', name: 'Prawns Pepper Fry', price: 360, description: 'Fresh prawns stir-fried with crushed black pepper and curry leaves.', calories: 320, tags: ['Non-Veg', 'Seafood', 'Spicy'], category: 'Starters' },
  { id: '34', name: 'Mushroom Pepper Fry', price: 190, description: 'Button mushrooms sautéed with freshly ground black pepper.', calories: 200, tags: ['Vegetarian', 'Spicy'], category: 'Starters' },
  { id: '35', name: 'Chicken Tikka', price: 250, description: 'Boneless chicken chunks marinated in spices and yogurt, grilled in a tandoor.', calories: 300, tags: ['Non-Veg', 'High Protein'], category: 'Starters' },

  // Snacks
  { id: '36', name: 'Samosa', price: 40, description: 'Crispy pastry filled with spiced potatoes and peas.', calories: 250, tags: ['Vegetarian', 'Fried'], category: 'Snacks' },
  { id: '37', name: 'Onion Pakoda', price: 80, description: 'Crispy fritters made with sliced onions, gram flour, and spices.', calories: 300, tags: ['Vegetarian', 'Fried'], category: 'Snacks' },
  { id: '38', name: 'Mirchi Bajji', price: 60, description: 'Large green chilies dipped in gram flour batter and deep-fried.', calories: 220, tags: ['Vegetarian', 'Spicy', 'Fried'], category: 'Snacks' },
  { id: '39', name: 'Punugulu', price: 70, description: 'Crispy, deep-fried snack made from dosa batter.', calories: 280, tags: ['Vegetarian', 'Fried'], category: 'Snacks' },
  { id: '40', name: 'Mysore Bonda', price: 85, description: 'Soft, fluffy fritters made with urad dal and spices.', calories: 260, tags: ['Vegetarian', 'Fried'], category: 'Snacks' },
  { id: '41', name: 'Masala Vada', price: 60, description: 'Crunchy fritters made from coarsely ground chana dal and spices.', calories: 240, tags: ['Vegetarian', 'Fried'], category: 'Snacks' },
  { id: '42', name: 'Banana Chips', price: 50, description: 'Thinly sliced raw bananas deep-fried in coconut oil.', calories: 300, tags: ['Vegetarian', 'Vegan'], category: 'Snacks' },

  // Beverages
  { id: '4', name: 'Filter Coffee', price: 40, description: 'Authentic South Indian degree coffee, frothy and strong.', calories: 80, tags: ['Vegetarian', 'Beverage', 'Energy'], category: 'Beverages' },
  { id: '43', name: 'Masala Chai', price: 30, description: 'Indian tea brewed with milk, ginger, cardamom, and spices.', calories: 90, tags: ['Vegetarian', 'Beverage'], category: 'Beverages' },
  { id: '44', name: 'Sweet Lassi', price: 70, description: 'Refreshing yogurt-based drink sweetened with sugar and flavored with cardamom.', calories: 200, tags: ['Vegetarian', 'Beverage', 'Cooling'], category: 'Beverages' },
  { id: '45', name: 'Neer Mor', price: 40, description: 'Spiced South Indian buttermilk with ginger, green chilies, and coriander.', calories: 40, tags: ['Vegetarian', 'Beverage', 'Healthy', 'Cooling'], category: 'Beverages' },
  { id: '46', name: 'Fresh Lime Soda', price: 60, description: 'Refreshing soda with freshly squeezed lime juice, available sweet or salted.', calories: 120, tags: ['Vegetarian', 'Beverage', 'Vegan'], category: 'Beverages' },

  // Desserts
  { id: '47', name: 'Gulab Jamun', price: 80, description: 'Soft, deep-fried milk solids soaked in rose-flavored sugar syrup.', calories: 350, tags: ['Vegetarian', 'Sweet'], category: 'Desserts' },
  { id: '48', name: 'Rasmalai', price: 100, description: 'Soft paneer discs soaked in sweetened, thickened milk flavored with saffron.', calories: 300, tags: ['Vegetarian', 'Sweet'], category: 'Desserts' },
  { id: '49', name: 'Pal Payasam', price: 90, description: 'Traditional South Indian rice pudding cooked in milk and garnished with nuts.', calories: 320, tags: ['Vegetarian', 'Sweet'], category: 'Desserts' },
  { id: '50', name: 'Mysore Pak', price: 120, description: 'Rich, melt-in-the-mouth sweet made with generous amounts of ghee, sugar, and gram flour.', calories: 450, tags: ['Vegetarian', 'Sweet', 'Rich'], category: 'Desserts' },
  { id: '51', name: 'Kesari Bath', price: 70, description: 'Semolina pudding flavored with saffron, ghee, and roasted cashews.', calories: 380, tags: ['Vegetarian', 'Sweet'], category: 'Desserts' }
];
