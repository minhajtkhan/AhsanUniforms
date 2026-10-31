export interface CategoryItem {
  id: string
  name: string
  slug: string
  description?: string
}

export interface ProductItem {
  id: string
  category_id?: string
  name: string
  sku: string
  barcode?: string
  cost_price: number
  selling_price: number
  stock_quantity: number
  low_stock_threshold: number
  unit: string
  is_active: boolean
  category_name?: string
}

export interface CustomerItem {
  id: string
  name: string
  phone?: string | null
  email?: string | null
  address?: string | null
  notes?: string | null
  outstanding_balance: number
  credit_limit?: number
}

export interface ExpenseItem {
  id: string
  category_id?: string
  category_name: string
  title: string
  amount: number
  expense_date: string
  payment_method: 'cash' | 'credit'
  reference_no?: string
  notes?: string
  supplier_id?: string
  supplier_name?: string
  is_supplier_purchase?: boolean
}

export interface SupplierItem {
  id: string
  name: string
  contact_person: string
  phone: string
  email: string
  address: string
  payment_terms: string
  balance: number
}

export interface InvoiceItem {
  id: string
  invoice_number: string
  customer_id: string
  customer_name: string
  customer_phone?: string
  subtotal: number
  discount_amount: number
  tax_amount: number
  total_amount: number
  amount_paid: number
  amount_due: number
  payment_status: 'paid' | 'partial' | 'unpaid'
  payment_method: 'cash' | 'credit' | 'easypaisa' | 'partial'
  easypaisa_phone?: string
  cash_paid?: number
  credit_due?: number
  status: 'finalized' | 'draft' | 'cancelled'
  created_at: string
  items: Array<{
    id: string
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: '11111111-1111-1111-1111-000000000001', name: 'Notebooks & Copies', slug: 'notebooks', description: 'School exercise books, registers, drawing books' },
  { id: '11111111-1111-1111-1111-000000000002', name: 'Pens & Writing', slug: 'pens-writing', description: 'Ballpoint pens, fountain pens, markers' },
  { id: '11111111-1111-1111-1111-000000000003', name: 'Art Supplies', slug: 'art-supplies', description: 'Color pencils, poster paints, sketchbooks' },
  { id: '11111111-1111-1111-1111-000000000004', name: 'School Bags & Pouches', slug: 'school-bags', description: 'Backpacks, lunch bags, pencil cases' },
  { id: '11111111-1111-1111-1111-000000000005', name: 'Uniforms - Boys', slug: 'uniforms-boys', description: 'White shirts, grey trousers, neckties' },
  { id: '11111111-1111-1111-1111-000000000006', name: 'Uniforms - Girls', slug: 'uniforms-girls', description: 'Frocks, shalwar kameez sets, dupattas' },
  { id: '11111111-1111-1111-1111-000000000007', name: 'Books & Guides', slug: 'books-guides', description: 'Syllabus textbooks, Oxford workbooks' },
  { id: '11111111-1111-1111-1111-000000000008', name: 'Exam Supplies', slug: 'exam-supplies', description: 'Clipboards, geometry sets, calculators' },
  { id: '11111111-1111-1111-1111-000000000009', name: 'Office Stationery', slug: 'office-stationery', description: 'A4 box reams, staplers, punch machines, files' },
]

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: '55555555-5555-5555-5555-000000000001',
    category_id: '11111111-1111-1111-1111-000000000001',
    category_name: 'Notebooks & Copies',
    name: 'Classmate 4-Line English Exercise Copy (120 Pages)',
    sku: 'CPY-ENG-4L-120',
    barcode: '896400010011',
    cost_price: 85.00,
    selling_price: 130.00,
    stock_quantity: 140,
    low_stock_threshold: 25,
    unit: 'piece',
    is_active: true,
  },
  {
    id: '55555555-5555-5555-5555-000000000002',
    category_id: '11111111-1111-1111-1111-000000000001',
    category_name: 'Notebooks & Copies',
    name: 'Broad Line Urdu Exercise Copy (120 Pages)',
    sku: 'CPY-URD-BL-120',
    barcode: '896400010028',
    cost_price: 85.00,
    selling_price: 130.00,
    stock_quantity: 110,
    low_stock_threshold: 25,
    unit: 'piece',
    is_active: true,
  },
  {
    id: '55555555-5555-5555-5555-000000000005',
    category_id: '11111111-1111-1111-1111-000000000002',
    category_name: 'Pens & Writing',
    name: 'Piano Crystal Ballpoint Blue 0.8mm (Box of 10)',
    sku: 'PEN-PIA-BLU-10',
    barcode: '896400020010',
    cost_price: 150.00,
    selling_price: 220.00,
    stock_quantity: 65,
    low_stock_threshold: 15,
    unit: 'pack',
    is_active: true,
  },
  {
    id: '55555555-5555-5555-5555-000000000006',
    category_id: '11111111-1111-1111-1111-000000000002',
    category_name: 'Pens & Writing',
    name: 'Dollar SP-10 Fountain Pen (Medium Nib, Blue Body)',
    sku: 'PEN-DOL-SP10',
    barcode: '896400020027',
    cost_price: 90.00,
    selling_price: 140.00,
    stock_quantity: 45,
    low_stock_threshold: 10,
    unit: 'piece',
    is_active: true,
  },
  {
    id: '55555555-5555-5555-5555-000000000009',
    category_id: '11111111-1111-1111-1111-000000000003',
    category_name: 'Art Supplies',
    name: 'Picasso Triangular Color Pencils (24 Shades Tin)',
    sku: 'ART-PIC-COL-24',
    barcode: '896400030019',
    cost_price: 420.00,
    selling_price: 650.00,
    stock_quantity: 18,
    low_stock_threshold: 10,
    unit: 'pack',
    is_active: true,
  },
  {
    id: '55555555-5555-5555-5555-000000000010',
    category_id: '11111111-1111-1111-1111-000000000003',
    category_name: 'Art Supplies',
    name: 'Camel Poster Colors 12-Jar Set with Brush',
    sku: 'ART-CAM-POST-12',
    barcode: '896400030026',
    cost_price: 350.00,
    selling_price: 520.00,
    stock_quantity: 6,
    low_stock_threshold: 12,
    unit: 'pack',
    is_active: true,
  },
  {
    id: '55555555-5555-5555-5555-000000000014',
    category_id: '11111111-1111-1111-1111-000000000005',
    category_name: 'Uniforms - Boys',
    name: 'Boys School Uniform White Shirt',
    sku: 'UNI-BOY-SHT',
    barcode: '896400050017',
    cost_price: 570.00,
    selling_price: 870.00,
    stock_quantity: 45,
    low_stock_threshold: 10,
    unit: 'piece',
    is_active: true,
  },
  {
    id: '55555555-5555-5555-5555-000000000016',
    category_id: '11111111-1111-1111-1111-000000000005',
    category_name: 'Uniforms - Boys',
    name: 'Boys School Uniform Grey Pants',
    sku: 'UNI-BOY-PNT',
    barcode: '896400050031',
    cost_price: 600.00,
    selling_price: 920.00,
    stock_quantity: 40,
    low_stock_threshold: 8,
    unit: 'piece',
    is_active: true,
  },
  {
    id: '55555555-5555-5555-5555-000000000017',
    category_id: '11111111-1111-1111-1111-000000000006',
    category_name: 'Uniforms - Girls',
    name: 'Girls School Uniform Shirt / Kameez',
    sku: 'UNI-GRL-SHT',
    barcode: '896400060012',
    cost_price: 600.00,
    selling_price: 900.00,
    stock_quantity: 38,
    low_stock_threshold: 10,
    unit: 'piece',
    is_active: true,
  },
  {
    id: '55555555-5555-5555-5555-000000000018',
    category_id: '11111111-1111-1111-1111-000000000006',
    category_name: 'Uniforms - Girls',
    name: 'Girls School Uniform White Shalwar / Pants',
    sku: 'UNI-GRL-PNT',
    barcode: '896400060029',
    cost_price: 620.00,
    selling_price: 940.00,
    stock_quantity: 35,
    low_stock_threshold: 8,
    unit: 'piece',
    is_active: true,
  },
  {
    id: '55555555-5555-5555-5555-000000000021',
    category_id: '11111111-1111-1111-1111-000000000008',
    category_name: 'Exam Supplies',
    name: 'Bahadur Mathematical Geometry Box (Metal Case)',
    sku: 'EXM-BAH-GEOM',
    barcode: '896400080014',
    cost_price: 220.00,
    selling_price: 350.00,
    stock_quantity: 50,
    low_stock_threshold: 15,
    unit: 'piece',
    is_active: true,
  },
  {
    id: '55555555-5555-5555-5555-000000000023',
    category_id: '11111111-1111-1111-1111-000000000009',
    category_name: 'Office Stationery',
    name: 'Double A Photocopy Paper A4 80gsm Ream (500 Sheets)',
    sku: 'OFC-DBLA-A4-80',
    barcode: '896400090013',
    cost_price: 1150.00,
    selling_price: 1550.00,
    stock_quantity: 40,
    low_stock_threshold: 10,
    unit: 'pack',
    is_active: true,
  },
]

export const INITIAL_CUSTOMERS: CustomerItem[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Walk-in Customer (General)',
    phone: 'Counter Cash Sale',
    address: 'Ahsan Shop Counter',
    outstanding_balance: 0,
    credit_limit: 0,
    notes: 'Default walk-in sales',
  },
  {
    id: '44444444-4444-4444-4444-000000000001',
    name: 'Al-Huda Model Academy (Principal Office)',
    phone: '0301-5551234',
    email: 'info@alhuda-school.edu.pk',
    address: 'Sector G-10/4, Islamabad',
    outstanding_balance: 14500.00,
    credit_limit: 50000.00,
    notes: 'Regular institutional account. Monthly register orders.',
  },
  {
    id: '44444444-4444-4444-4444-000000000002',
    name: 'Tariq Mehmood (Advocate)',
    phone: '0322-9876543',
    email: 'tariq.advocate@gmail.com',
    address: 'House 42, Street 8, G-9/1, Islamabad',
    outstanding_balance: 2200.00,
    credit_limit: 10000.00,
    notes: 'Parent of 3 students. Uniforms and books.',
  },
  {
    id: '44444444-4444-4444-4444-000000000003',
    name: 'Mrs. Shazia Khan',
    phone: '0345-1239874',
    email: 'shazia.k@yahoo.com',
    address: 'Flat 3-B, Executive Heights, Islamabad',
    outstanding_balance: 0.00,
    credit_limit: 5000.00,
    notes: 'Always pays cash or JazzCash on counter.',
  },
  {
    id: '44444444-4444-4444-4444-000000000004',
    name: 'Usman Rafiq Engineering Academy',
    phone: '0312-3456789',
    email: 'usman@rafiqacademy.pk',
    address: 'Blue Area Commercial Plaza, 2nd Floor',
    outstanding_balance: 8900.00,
    credit_limit: 35000.00,
    notes: 'Buys A4 paper reams, whiteboard markers, geometry instruments.',
  },
]

export const INITIAL_INVOICES: InvoiceItem[] = [
  {
    id: '66666666-6666-6666-6666-000000000001',
    invoice_number: 'AS-2026-0001',
    customer_id: '44444444-4444-4444-4444-000000000002',
    customer_name: 'Tariq Mehmood (Advocate)',
    customer_phone: '0322-9876543',
    subtotal: 3540.00,
    discount_amount: 140.00,
    tax_amount: 0,
    total_amount: 3400.00,
    amount_paid: 3400.00,
    amount_due: 0,
    payment_status: 'paid',
    payment_method: 'cash',
    status: 'finalized',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { id: '1', product_name: 'Boys School Uniform White Shirt (Size 30)', quantity: 2, unit_price: 950.00, total_price: 1900.00 },
      { id: '2', product_name: 'Boys School Uniform Grey Trousers (Size 32)', quantity: 1, unit_price: 1350.00, total_price: 1350.00 },
      { id: '3', product_name: 'Piano Crystal Ballpoint Blue (Box of 10)', quantity: 1, unit_price: 220.00, total_price: 220.00 },
    ],
  },
  {
    id: '66666666-6666-6666-6666-000000000002',
    invoice_number: 'AS-2026-0002',
    customer_id: '44444444-4444-4444-4444-000000000001',
    customer_name: 'Al-Huda Model Academy',
    customer_phone: '0301-5551234',
    subtotal: 18000.00,
    discount_amount: 0,
    tax_amount: 0,
    total_amount: 18000.00,
    amount_paid: 10000.00,
    amount_due: 8000.00,
    payment_status: 'partial',
    payment_method: 'credit',
    status: 'finalized',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { id: '1', product_name: 'Double A Photocopy Paper A4 80gsm Ream', quantity: 10, unit_price: 1550.00, total_price: 15500.00 },
      { id: '2', product_name: 'Bahadur Mathematical Geometry Box', quantity: 7, unit_price: 350.00, total_price: 2450.00 },
    ],
  },
  {
    id: '66666666-6666-6666-6666-000000000003',
    invoice_number: 'AS-2026-0003',
    customer_id: '00000000-0000-0000-0000-000000000001',
    customer_name: 'Walk-in Customer',
    customer_phone: 'Counter Cash',
    subtotal: 1560.00,
    discount_amount: 60.00,
    tax_amount: 0,
    total_amount: 1500.00,
    amount_paid: 1500.00,
    amount_due: 0,
    payment_status: 'paid',
    payment_method: 'cash',
    status: 'finalized',
    created_at: new Date().toISOString(),
    items: [
      { id: '1', product_name: 'Classmate 4-Line English Exercise Copy', quantity: 6, unit_price: 130.00, total_price: 780.00 },
      { id: '2', product_name: 'Broad Line Urdu Exercise Copy', quantity: 6, unit_price: 130.00, total_price: 780.00 },
    ],
  },
]

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: '22222222-2222-2222-2222-000000000001',
    category_name: 'Material & Stock Purchase',
    title: 'Purchase of Oxford registers & exercise copies stock',
    amount: 35000.00,
    expense_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    payment_method: 'credit',
    reference_no: 'INV-NAT-4921',
    is_supplier_purchase: true,
    supplier_id: '33333333-3333-3333-3333-000000000001',
    supplier_name: 'National Book & Stationery Wholesalers',
  },
  {
    id: '22222222-2222-2222-2222-000000000002',
    category_name: 'Electricity & Utilities',
    title: 'WAPDA electricity commercial bill',
    amount: 8450.00,
    expense_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    payment_method: 'cash',
    reference_no: 'BILL-WAPDA-9102',
  },
  {
    id: '22222222-2222-2222-2222-000000000003',
    category_name: 'Chai & Daily Refreshments',
    title: 'Weekly staff tea, milk, biscuits & mineral water',
    amount: 1850.00,
    expense_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    payment_method: 'cash',
    reference_no: 'CHAI-WK-4',
  },
  {
    id: '22222222-2222-2222-2222-000000000004',
    category_name: 'Packaging & Bags',
    title: 'Ahsan Shop printed shopping bags bundle (20kg)',
    amount: 4200.00,
    expense_date: new Date().toISOString().split('T')[0],
    payment_method: 'cash',
    reference_no: 'BAGS-PRINT-01',
  },
]

export const INITIAL_SUPPLIERS: SupplierItem[] = [
  {
    id: '33333333-3333-3333-3333-000000000001',
    name: 'National Book & Stationery Wholesalers',
    contact_person: 'Haji Mohammad Rafiq',
    phone: '0300-8452109',
    email: 'rafiq@nationalbooks.pk',
    address: 'Shop # 45, Main Urdu Bazar, Lahore',
    payment_terms: 'Net 30 Days',
    balance: 15500.00,
  },
  {
    id: '33333333-3333-3333-3333-000000000002',
    name: 'Sitara Textile Mills (Uniform Division)',
    contact_person: 'Sheikh Tariq Mehmood',
    phone: '0321-7654321',
    email: 'tariq@sitaratextiles.com',
    address: 'Plot 12, Mill Area, Faisalabad',
    payment_terms: 'Net 15 Days',
    balance: 28000.00,
  },
  {
    id: '33333333-3333-3333-3333-000000000003',
    name: 'Dollar Industries (Pvt) Ltd Distribution',
    contact_person: 'Khurram Shehzad',
    phone: '0333-4129876',
    email: 'orders@dollarpen.com.pk',
    address: 'Korangi Industrial Area, Karachi',
    payment_terms: 'Cash on Delivery',
    balance: 0.00,
  },
]
