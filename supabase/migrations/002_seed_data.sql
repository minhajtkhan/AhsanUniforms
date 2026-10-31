-- ============================================================================
-- AHSAN SHOP — SEED DATA MIGRATION (002_seed_data.sql)
-- Realistic starter data for Pakistani Stationery & School Uniform Retail Shop
-- Currency: PKR (Rs.)
-- ============================================================================

-- 1. PRODUCT CATEGORIES
INSERT INTO categories (id, name, slug, description) VALUES
  ('11111111-1111-1111-1111-000000000001', 'Notebooks & Copies', 'notebooks', 'School exercise books, registers, drawing books, spiral notebooks'),
  ('11111111-1111-1111-1111-000000000002', 'Pens & Writing', 'pens-writing', 'Ballpoint pens, fountain pens, gel pens, markers, highlighters'),
  ('11111111-1111-1111-1111-000000000003', 'Art Supplies', 'art-supplies', 'Color pencils, poster paints, oil pastels, sketchbooks, craft paper'),
  ('11111111-1111-1111-1111-000000000004', 'School Bags & Pouches', 'school-bags', 'Backpacks, lunch bags, pencil cases, geometry pouches'),
  ('11111111-1111-1111-1111-000000000005', 'Uniforms - Boys', 'uniforms-boys', 'White shirts, grey/khaki trousers, neckties, school belts, socks'),
  ('11111111-1111-1111-1111-000000000006', 'Uniforms - Girls', 'uniforms-girls', 'Frocks, shalwar kameez sets, dupattas, white sashes, hair bands'),
  ('11111111-1111-1111-1111-000000000007', 'Books & Guides', 'books-guides', 'Syllabus textbooks, Oxford workbooks, dictionaries, Islamic studies'),
  ('11111111-1111-1111-1111-000000000008', 'Exam Supplies', 'exam-supplies', 'Exam clipboards, geometry sets, mathematical tables, calculators'),
  ('11111111-1111-1111-1111-000000000009', 'Office Stationery', 'office-stationery', 'A4 box reams, staplers, punch machines, files, folders, tapes')
ON CONFLICT (slug) DO NOTHING;

-- 2. EXPENSE CATEGORIES
INSERT INTO expense_categories (id, name, description) VALUES
  ('22222222-2222-2222-2222-000000000001', 'Shop Rent', 'Monthly commercial lease / shop rent'),
  ('22222222-2222-2222-2222-000000000002', 'Electricity & Utilities', 'WAPDA/KE electricity bills, backup UPS battery maintenance'),
  ('22222222-2222-2222-2222-000000000003', 'Staff Salaries', 'Wages for counter sales assistants and helpers'),
  ('22222222-2222-2222-2222-000000000004', 'Chai & Daily Refreshments', 'Daily tea, biscuits, mineral water for staff and guests'),
  ('22222222-2222-2222-2222-000000000005', 'Packaging & Bags', 'Printed Ahsan Shop shopping bags, wrapping paper, packing tapes'),
  ('22222222-2222-2222-2222-000000000006', 'Freight & Cargo', 'Goods transport charges from Urdu Bazar and Faisalabad mills'),
  ('22222222-2222-2222-2222-000000000007', 'Shop Maintenance', 'Lighting, cleaning items, shelf repairs, general upkeep')
ON CONFLICT (name) DO NOTHING;

-- 3. SUPPLIERS
INSERT INTO suppliers (id, name, contact_person, phone, email, address, payment_terms, balance) VALUES
  (
    '33333333-3333-3333-3333-000000000001',
    'National Book & Stationery Wholesalers',
    'Haji Mohammad Rafiq',
    '0300-8452109',
    'rafiq@nationalbooks.pk',
    'Shop # 45, Main Urdu Bazar, Lahore',
    'Net 30 Days',
    15500.00
  ),
  (
    '33333333-3333-3333-3333-000000000002',
    'Sitara Textile Mills (Uniform Division)',
    'Sheikh Tariq Mehmood',
    '0321-7654321',
    'tariq@sitaratextiles.com',
    'Plot 12, Mill Area, Faisalabad',
    'Net 15 Days',
    28000.00
  ),
  (
    '33333333-3333-3333-3333-000000000003',
    'Dollar Industries (Pvt) Ltd Distribution',
    'Khurram Shehzad',
    '0333-4129876',
    'orders@dollarpen.com.pk',
    'Korangi Industrial Area, Karachi',
    'Cash on Delivery',
    0.00
  )
ON CONFLICT (id) DO NOTHING;

-- 4. CUSTOMERS
INSERT INTO customers (id, name, phone, email, address, notes, outstanding_balance) VALUES
  (
    '44444444-4444-4444-4444-000000000001',
    'Al-Huda Model Academy (Principal Office)',
    '0301-5551234',
    'info@alhuda-school.edu.pk',
    'Sector G-10/4, Islamabad',
    'Regular school account. Buys monthly registers and teacher planners. Credit limit: Rs. 50,000.',
    14500.00
  ),
  (
    '44444444-4444-4444-4444-000000000002',
    'Tariq Mehmood (Advocate)',
    '0322-9876543',
    'tariq.advocate@gmail.com',
    'House 42, Street 8, G-9/1, Islamabad',
    'Parent of 3 school students. Uniforms and syllabus books. Credit limit: Rs. 10,000.',
    2200.00
  ),
  (
    '44444444-4444-4444-4444-000000000003',
    'Mrs. Shazia Khan',
    '0345-1239874',
    'shazia.k@yahoo.com',
    'Flat 3-B, Executive Heights, Islamabad',
    'Always pays via JazzCash or cash on counter.',
    0.00
  ),
  (
    '44444444-4444-4444-4444-000000000004',
    'Usman Rafiq Engineering Academy',
    '0312-3456789',
    'usman@rafiqacademy.pk',
    'Blue Area Commercial Plaza, 2nd Floor',
    'Buys A4 paper reams, whiteboard markers, and geometry instruments. Credit limit: Rs. 35,000.',
    8900.00
  ),
  (
    '44444444-4444-4444-4444-000000000005',
    'Fatima Bibi',
    '0334-9988776',
    NULL,
    'Street 14, Near Jamia Masjid',
    'Buys monthly kids notebooks and pencils.',
    450.00
  )
ON CONFLICT (id) DO NOTHING;

-- 5. REALISTIC PRODUCTS (24 Products across categories with Pakistani Rupee Rs. pricing)
INSERT INTO products (
  id,
  category_id,
  name,
  sku,
  barcode,
  description,
  cost_price,
  selling_price,
  stock_quantity,
  min_stock_alert,
  unit,
  is_active
) VALUES
  -- Notebooks & Copies
  (
    '55555555-5555-5555-5555-000000000001',
    '11111111-1111-1111-1111-000000000001',
    'Oxford Urdu Khushkhati Exercise Book (120 Pages)',
    'NB-OXF-URD-120',
    '896400010011',
    'High quality 70gsm cream paper for Urdu calligraphy practice',
    90.00,
    140.00,
    85,
    20,
    'piece',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000002',
    '11111111-1111-1111-1111-000000000001',
    'Standard Four-Line English Copy (160 Pages)',
    'NB-ENG-4LINE-160',
    '896400010028',
    'Four-line ruled English notebook for primary classes',
    110.00,
    170.00,
    120,
    25,
    'piece',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000003',
    '11111111-1111-1111-1111-000000000001',
    'Mathematics Square Grid Notebook (200 Pages)',
    'NB-MTH-GRID-200',
    '896400010035',
    'Medium grid square copy for arithmetic and algebra practice',
    130.00,
    200.00,
    45,
    20,
    'piece',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000001',
    '11111111-1111-1111-1111-000000000004',
    'A4 Hardcover College Register (300 Pages)',
    'NB-REG-A4-300',
    '896400010042',
    'Heavy duty hardbound register with index for college students',
    240.00,
    380.00,
    14, -- low stock trigger!
    20,
    'piece',
    true
  ),

  -- Pens & Writing
  (
    '55555555-5555-5555-5555-000000000005',
    '11111111-1111-1111-1111-000000000002',
    'Piano Crystal Ballpoint Blue 0.8mm (Box of 10)',
    'PEN-PIA-BLU-10',
    '896400020010',
    'Smooth writing oil-based ballpoint pen packet',
    150.00,
    220.00,
    60,
    15,
    'pack',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000006',
    '11111111-1111-1111-1111-000000000002',
    'Dollar Clipper Fountain Pen (Hero Nib, Black)',
    'PEN-DOL-CLIP-FNT',
    '896400020027',
    'Classic piston filler school fountain pen',
    110.00,
    180.00,
    32,
    10,
    'piece',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000007',
    '11111111-1111-1111-1111-000000000002',
    'Dollar 60ml Blue Fountain Pen Ink Bottle',
    'INK-DOL-BLU-60',
    '896400020034',
    'Non-clogging vibrant royal blue ink',
    75.00,
    120.00,
    50,
    12,
    'piece',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000008',
    '11111111-1111-1111-1111-000000000002',
    'Snowman Whiteboard Marker Set (4 Assorted Colors)',
    'MRK-SNW-WB-4',
    '896400020041',
    'Dry wipe bullet tip markers: Black, Blue, Red, Green',
    280.00,
    420.00,
    28,
    10,
    'pack',
    true
  ),

  -- Art Supplies
  (
    '55555555-5555-5555-5555-000000000009',
    '11111111-1111-1111-1111-000000000003',
    'Picasso Triangular Color Pencils (24 Shades Tin)',
    'ART-PIC-COL-24',
    '896400030019',
    'Break-resistant soft lead colored pencils in embossed tin',
    420.00,
    650.00,
    18,
    10,
    'pack',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000010',
    '11111111-1111-1111-1111-000000000003',
    'Camel Poster Colors 12-Jar Set with Brush',
    'ART-CAM-POST-12',
    '896400030026',
    'Opaque vibrant tempera paints for school arts & craft',
    350.00,
    520.00,
    8, -- low stock trigger!
    12,
    'pack',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000011',
    '11111111-1111-1111-1111-000000000003',
    'Spiral Art Sketchbook Cartridge Paper (30 Sheets A3)',
    'ART-SKT-A3-30',
    '896400030033',
    '140gsm heavyweight acid-free sketchpad',
    210.00,
    330.00,
    22,
    10,
    'piece',
    true
  ),

  -- School Bags & Pouches
  (
    '55555555-5555-5555-5555-000000000012',
    '11111111-1111-1111-1111-000000000004',
    'Champion Waterproof Heavy Canvas School Bag (Navy)',
    'BAG-CANV-NAVY-L',
    '896400040018',
    'Padded shoulder straps with 3 compartments & water bottle mesh',
    1250.00,
    1950.00,
    15,
    5,
    'piece',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000013',
    '11111111-1111-1111-1111-000000000004',
    'Dual-Zipper Canvas Pencil Pouch with Ruler Slot',
    'BAG-PCH-CANV-2Z',
    '896400040025',
    'Durable washable organizer pouch for pens & geometry tools',
    140.00,
    250.00,
    35,
    10,
    'piece',
    true
  ),

  -- Uniforms - Boys
  (
    '55555555-5555-5555-5555-000000000014',
    '11111111-1111-1111-1111-000000000005',
    'Boys School Uniform White Shirt (Size 30)',
    'UNI-B-SHT-WHT-30',
    '896400050017',
    'Premium cotton-poly blend easy iron shirt for primary classes',
    620.00,
    950.00,
    24,
    8,
    'piece',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000015',
    '11111111-1111-1111-1111-000000000005',
    'Boys School Uniform White Shirt (Size 34)',
    'UNI-B-SHT-WHT-34',
    '896400050024',
    'Premium cotton-poly blend easy iron shirt for middle classes',
    720.00,
    1100.00,
    19,
    8,
    'piece',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000016',
    '11111111-1111-1111-1111-000000000005',
    'Boys School Uniform Grey Trousers (Size 32)',
    'UNI-B-TRS-GRY-32',
    '896400050031',
    'Wrinkle-free blended gabardine trousers with adjustable waist',
    850.00,
    1350.00,
    16,
    6,
    'piece',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000017',
    '11111111-1111-1111-1111-000000000005',
    'Official School Striped Uniform Necktie & Belt Combo',
    'UNI-B-ACC-TIEBLT',
    '896400050048',
    'Standard navy/maroon stripe woven tie with adjustable steel buckle belt',
    260.00,
    450.00,
    40,
    12,
    'pack',
    true
  ),

  -- Uniforms - Girls
  (
    '55555555-5555-5555-5555-000000000018',
    '11111111-1111-1111-1111-000000000006',
    'Girls School Uniform Frock with Belt (Size 28)',
    'UNI-G-FRK-NAV-28',
    '896400060016',
    'Pleated navy blue uniform frock with white collar and cuffs',
    950.00,
    1550.00,
    12,
    5,
    'piece',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000019',
    '11111111-1111-1111-1111-000000000006',
    'Girls Shalwar Qameez Uniform Set White (Size 34)',
    'UNI-G-SQ-WHT-34',
    '896400060023',
    'Fine lawn-cotton complete uniform pair with matching dupatta',
    1200.00,
    1950.00,
    9,
    5,
    'set',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000020',
    '11111111-1111-1111-1111-000000000006',
    'Girls Cotton White Scarf / Dupatta with School Edge',
    'UNI-G-DUP-WHT-MD',
    '896400060030',
    'Soft breathable cotton voile scarf with stitched border',
    210.00,
    350.00,
    30,
    10,
    'piece',
    true
  ),

  -- Exam Supplies
  (
    '55555555-5555-5555-5555-000000000021',
    '11111111-1111-1111-1111-000000000008',
    'Bahadur Mathematical Geometry Box (Metal Case)',
    'EXM-BAH-GEOM-BX',
    '896400080014',
    'Precision compass, divider, 15cm ruler, set squares, and protractor',
    220.00,
    350.00,
    55,
    15,
    'piece',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000022',
    '11111111-1111-1111-1111-000000000008',
    'A4 Transparent Acrylic Exam Clipboard with Spring Clamp',
    'EXM-CLP-ACRY-A4',
    '896400080021',
    'Shatter-proof transparent exam writing board required for board exams',
    160.00,
    280.00,
    38,
    12,
    'piece',
    true
  ),

  -- Office Stationery
  (
    '55555555-5555-5555-5555-000000000023',
    '11111111-1111-1111-1111-000000000009',
    'Double A Photocopy Paper A4 80gsm Ream (500 Sheets)',
    'OFF-PPR-DBLA-A4',
    '896400090013',
    'Super premium high brightness A4 paper for laser printing & copy',
    1150.00,
    1550.00,
    25,
    10,
    'ream',
    true
  ),
  (
    '55555555-5555-5555-5555-000000000024',
    '11111111-1111-1111-1111-000000000009',
    'Deli Heavy Duty Stapler #10 with Box of 1000 Staples',
    'OFF-STP-DEL-10BX',
    '896400090020',
    'Ergonomic steel stapler binds up to 25 sheets smoothly',
    240.00,
    390.00,
    17,
    8,
    'pack',
    true
  )
ON CONFLICT (sku) DO NOTHING;

-- 6. STOCK MOVEMENTS (Initial opening inventory entries)
INSERT INTO stock_movements (product_id, movement_type, quantity, cost_price, notes)
SELECT
  id,
  'in',
  stock_quantity,
  cost_price,
  'Opening inventory batch'
FROM products
WHERE stock_quantity > 0;

-- 7. SAMPLE EXPENSES (5 across recent days)
INSERT INTO expenses (category_id, amount, payment_method, expense_date, title, reference_no) VALUES
  (
    '22222222-2222-2222-2222-000000000001',
    35000.00,
    'bank_transfer',
    CURRENT_DATE - INTERVAL '15 days',
    'Shop Monthly Rent for Ahsan Shop building ground floor',
    'RENT-OCT-2026'
  ),
  (
    '22222222-2222-2222-2222-000000000002',
    8450.00,
    'cash',
    CURRENT_DATE - INTERVAL '10 days',
    'IESCO Electricity Bill for Shop',
    'BILL-IESCO-49210'
  ),
  (
    '22222222-2222-2222-2222-000000000004',
    1850.00,
    'cash',
    CURRENT_DATE - INTERVAL '6 days',
    'Weekly Chai & biscuits account for counter staff and customers',
    'CHAI-WK-1'
  ),
  (
    '22222222-2222-2222-2222-000000000005',
    4200.00,
    'cash',
    CURRENT_DATE - INTERVAL '4 days',
    '500 Printed Kraft Paper Ahsan Shop Carrying Bags',
    'BAGS-500-KRAFT'
  ),
  (
    '22222222-2222-2222-2222-000000000006',
    2300.00,
    'cash',
    CURRENT_DATE - INTERVAL '2 days',
    'Urdu Bazar transport van delivery charges for winter uniforms batch',
    'CARGO-UB-081'
  );

-- 8. SAMPLE INVOICES & ITEMS ACROSS PAST 30 DAYS
-- Invoice 1: Completed cash sale
INSERT INTO invoices (
  id,
  invoice_number,
  customer_id,
  subtotal,
  discount_type,
  discount_value,
  tax_rate,
  total_amount,
  paid_amount,
  payment_status,
  created_at
) VALUES (
  '66666666-6666-6666-6666-000000000001',
  'INV-2026-0001',
  '44444444-4444-4444-4444-000000000002',
  3540.00,
  'fixed',
  140.00,
  0,
  3400.00,
  3400.00,
  'paid',
  CURRENT_TIMESTAMP - INTERVAL '25 days'
);

INSERT INTO invoice_items (invoice_id, product_id, product_name, quantity, unit_price, cost_price, total_price) VALUES
  ('66666666-6666-6666-6666-000000000001', '55555555-5555-5555-5555-000000000014', 'Boys School Uniform White Shirt (Size 30)', 2, 950.00, 620.00, 1900.00),
  ('66666666-6666-6666-6666-000000000001', '55555555-5555-5555-5555-000000000016', 'Boys School Uniform Grey Trousers (Size 32)', 1, 1350.00, 850.00, 1350.00),
  ('66666666-6666-6666-6666-000000000001', '55555555-5555-5555-5555-000000000005', 'Piano Crystal Ballpoint Blue 0.8mm (Box of 10)', 1, 220.00, 150.00, 220.00),
  ('66666666-6666-6666-6666-000000000001', '55555555-5555-5555-5555-000000000007', 'Dollar 60ml Blue Fountain Pen Ink Bottle', 1, 120.00, 75.00, 120.00);

INSERT INTO payments (invoice_id, customer_id, amount, payment_method, notes) VALUES
  ('66666666-6666-6666-6666-000000000001', '44444444-4444-4444-4444-000000000002', 3400.00, 'cash', 'Full payment on counter');

-- Invoice 2: Bulk Academy Sale with Partial Payment (Balance remaining)
INSERT INTO invoices (
  id,
  invoice_number,
  customer_id,
  subtotal,
  discount_type,
  discount_value,
  tax_rate,
  total_amount,
  paid_amount,
  payment_status,
  created_at
) VALUES (
  '66666666-6666-6666-6666-000000000002',
  'INV-2026-0002',
  '44444444-4444-4444-4444-000000000001',
  24500.00,
  'fixed',
  1000.00,
  0,
  23500.00,
  9000.00,
  'partial',
  CURRENT_TIMESTAMP - INTERVAL '18 days'
);

INSERT INTO invoice_items (invoice_id, product_id, product_name, quantity, unit_price, cost_price, total_price) VALUES
  ('66666666-6666-6666-6666-000000000002', '55555555-5555-5555-5555-000000000023', 'Double A Photocopy Paper A4 80gsm Ream (500 Sheets)', 10, 1550.00, 1150.00, 15500.00),
  ('66666666-6666-6666-6666-000000000002', '55555555-5555-5555-5555-000000000008', 'Snowman Whiteboard Marker Set (4 Assorted Colors)', 10, 420.00, 280.00, 4200.00),
  ('66666666-6666-6666-6666-000000000002', '55555555-5555-5555-5555-000000000024', 'Deli Heavy Duty Stapler #10 with Box of 1000 Staples', 6, 390.00, 240.00, 2340.00);

INSERT INTO payments (invoice_id, customer_id, amount, payment_method, notes) VALUES
  ('66666666-6666-6666-6666-000000000002', '44444444-4444-4444-4444-000000000001', 9000.00, 'bank_transfer', 'Cheque received, balance Rs. 14,500 due on 30th');

-- Invoice 3: Walk-in counter customer (No profile customer)
INSERT INTO invoices (
  id,
  invoice_number,
  customer_id,
  subtotal,
  discount_type,
  discount_value,
  tax_rate,
  total_amount,
  paid_amount,
  payment_status,
  created_at
) VALUES (
  '66666666-6666-6666-6666-000000000003',
  'INV-2026-0003',
  NULL,
  2600.00,
  'fixed',
  0,
  0,
  2600.00,
  2600.00,
  'paid',
  CURRENT_TIMESTAMP - INTERVAL '12 days'
);

INSERT INTO invoice_items (invoice_id, product_id, product_name, quantity, unit_price, cost_price, total_price) VALUES
  ('66666666-6666-6666-6666-000000000003', '55555555-5555-5555-5555-000000000012', 'Champion Waterproof Heavy Canvas School Bag (Navy)', 1, 1950.00, 1250.00, 1950.00),
  ('66666666-6666-6666-6666-000000000003', '55555555-5555-5555-5555-000000000009', 'Picasso Triangular Color Pencils (24 Shades Tin)', 1, 650.00, 420.00, 650.00);

INSERT INTO payments (invoice_id, customer_id, amount, payment_method, notes) VALUES
  ('66666666-6666-6666-6666-000000000003', NULL, 2600.00, 'easypaisa', 'Quick mobile QR payment at counter');

-- Invoice 4: Girls uniform set for Mrs. Shazia Khan
INSERT INTO invoices (
  id,
  invoice_number,
  customer_id,
  subtotal,
  discount_type,
  discount_value,
  tax_rate,
  total_amount,
  paid_amount,
  payment_status,
  created_at
) VALUES (
  '66666666-6666-6666-6666-000000000004',
  'INV-2026-0004',
  '44444444-4444-4444-4444-000000000003',
  3850.00,
  'fixed',
  50.00,
  0,
  3800.00,
  3800.00,
  'paid',
  CURRENT_TIMESTAMP - INTERVAL '7 days'
);

INSERT INTO invoice_items (invoice_id, product_id, product_name, quantity, unit_price, cost_price, total_price) VALUES
  ('66666666-6666-6666-6666-000000000004', '55555555-5555-5555-5555-000000000019', 'Girls Shalwar Qameez Uniform Set White (Size 34)', 1, 1950.00, 1200.00, 1950.00),
  ('66666666-6666-6666-6666-000000000004', '55555555-5555-5555-5555-000000000018', 'Girls School Uniform Frock with Belt (Size 28)', 1, 1550.00, 950.00, 1550.00),
  ('66666666-6666-6666-6666-000000000004', '55555555-5555-5555-5555-000000000020', 'Girls Cotton White Scarf / Dupatta with School Edge', 1, 350.00, 210.00, 350.00);

INSERT INTO payments (invoice_id, customer_id, amount, payment_method, notes) VALUES
  ('66666666-6666-6666-6666-000000000004', '44444444-4444-4444-4444-000000000003', 3800.00, 'jazzcash', 'Direct JazzCash transfer to shop merchant number');

-- Invoice 5: Exam stationery for Usman Rafiq Academy
INSERT INTO invoices (
  id,
  invoice_number,
  customer_id,
  subtotal,
  discount_type,
  discount_value,
  tax_rate,
  total_amount,
  paid_amount,
  payment_status,
  created_at
) VALUES (
  '66666666-6666-6666-6666-000000000005',
  'INV-2026-0005',
  '44444444-4444-4444-4444-000000000004',
  18900.00,
  'fixed',
  900.00,
  0,
  18000.00,
  9100.00,
  'partial',
  CURRENT_TIMESTAMP - INTERVAL '3 days'
);

INSERT INTO invoice_items (invoice_id, product_id, product_name, quantity, unit_price, cost_price, total_price) VALUES
  ('66666666-6666-6666-6666-000000000005', '55555555-5555-5555-5555-000000000021', 'Bahadur Mathematical Geometry Box (Metal Case)', 20, 350.00, 220.00, 7000.00),
  ('66666666-6666-6666-6666-000000000005', '55555555-5555-5555-5555-000000000022', 'A4 Transparent Acrylic Exam Clipboard with Spring Clamp', 20, 280.00, 160.00, 5600.00),
  ('66666666-6666-6666-6666-000000000005', '55555555-5555-5555-5555-000000000023', 'Double A Photocopy Paper A4 80gsm Ream (500 Sheets)', 4, 1550.00, 1150.00, 6200.00);

INSERT INTO payments (invoice_id, customer_id, amount, payment_method, notes) VALUES
  ('66666666-6666-6666-6666-000000000005', '44444444-4444-4444-4444-000000000004', 9100.00, 'cash', 'Advance 50% paid on delivery; remaining Rs. 8,900 due next week');

-- 9. SAMPLE DAILY CLOSING (Yesterday)
INSERT INTO daily_closings (
  closing_date,
  opening_cash,
  total_sales,
  cash_sales,
  card_sales,
  online_sales,
  credit_sales,
  total_expenses,
  expected_cash,
  actual_cash,
  discrepancy,
  notes
) VALUES (
  CURRENT_DATE - INTERVAL '1 day',
  5000.00,
  34200.00,
  24200.00,
  0.00,
  6400.00,
  3600.00,
  2300.00,
  26900.00, -- opening 5000 + cash sales 24200 - expenses 2300 = 26900
  26900.00,
  0.00,
  'Register closed smoothly. Cash matched precisely with counter drawer.'
) ON CONFLICT (closing_date) DO NOTHING;
