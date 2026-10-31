export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'owner' | 'cashier'
export type InvoiceStatus = 'draft' | 'held' | 'finalized' | 'cancelled' | 'returned'
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'mobile_wallet' | 'credit'
export type PaymentStatus = 'paid' | 'partial' | 'unpaid' | 'overdue'
export type StockMovementType = 'sale' | 'purchase' | 'adjustment' | 'return' | 'damage'
export type ExpensePaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'mobile_wallet'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          role: UserRole
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      settings: {
        Row: {
          id: string
          shop_name: string
          shop_address: string | null
          shop_phone: string | null
          shop_email: string | null
          logo_url: string | null
          currency: string
          currency_symbol: string
          tax_rate: number
          invoice_prefix: string
          invoice_counter: number
          invoice_footer: string | null
          invoice_terms: string | null
          language: string
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['settings']['Row']>
        Update: Partial<Database['public']['Tables']['settings']['Row']>
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string | null
          sort_order: number | null
          deleted_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          description: string | null
          sku: string | null
          barcode: string | null
          cost_price: number
          selling_price: number
          stock_quantity: number
          low_stock_threshold: number
          unit: string
          has_variants: boolean
          image_url: string | null
          is_active: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          sku: string | null
          size: string | null
          color: string | null
          school_name: string | null
          additional_price: number
          stock_quantity: number
          image_url: string | null
          is_active: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['product_variants']['Insert']>
      }
      customers: {
        Row: {
          id: string
          name: string
          phone: string | null
          email: string | null
          address: string | null
          school_name: string | null
          notes: string | null
          outstanding_balance: number
          deleted_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at' | 'outstanding_balance'>
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      suppliers: {
        Row: {
          id: string
          name: string
          contact_person: string | null
          phone: string | null
          email: string | null
          address: string | null
          notes: string | null
          outstanding_payable: number
          deleted_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['suppliers']['Row'], 'id' | 'created_at' | 'updated_at' | 'outstanding_payable'>
        Update: Partial<Database['public']['Tables']['suppliers']['Insert']>
      }
      invoices: {
        Row: {
          id: string
          invoice_number: string
          customer_id: string
          status: InvoiceStatus
          payment_status: PaymentStatus
          payment_method: PaymentMethod | null
          subtotal: number
          discount_type: 'percentage' | 'fixed' | null
          discount_value: number
          discount_amount: number
          tax_rate: number
          tax_amount: number
          total_amount: number
          amount_paid: number
          amount_due: number
          notes: string | null
          finalized_at: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          product_id: string | null
          variant_id: string | null
          product_name: string
          variant_details: string | null
          sku: string | null
          quantity: number
          unit_price: number
          discount_amount: number
          total_price: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['invoice_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['invoice_items']['Insert']>
      }
      payments: {
        Row: {
          id: string
          invoice_id: string | null
          customer_id: string
          amount: number
          payment_method: PaymentMethod
          payment_date: string
          reference_no: string | null
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
      expenses: {
        Row: {
          id: string
          category_id: string | null
          title: string
          amount: number
          expense_date: string
          payment_method: ExpensePaymentMethod
          reference_no: string | null
          notes: string | null
          receipt_url: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['expenses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['expenses']['Insert']>
      }
      expense_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          deleted_at: string | null
          created_at: string
          created_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['expense_categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['expense_categories']['Insert']>
      }
      stock_movements: {
        Row: {
          id: string
          product_id: string
          variant_id: string | null
          movement_type: StockMovementType
          quantity: number
          quantity_before: number
          quantity_after: number
          reference_id: string | null
          reference_type: string | null
          reason: string | null
          created_at: string
          created_by: string | null
        }
        Insert: Omit<Database['public']['Tables']['stock_movements']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['stock_movements']['Insert']>
      }
      daily_closings: {
        Row: {
          id: string
          closing_date: string
          opening_cash: number
          sales_cash: number
          sales_card: number
          sales_other: number
          total_sales: number
          total_expenses: number
          closing_cash: number
          notes: string | null
          closed_by: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['daily_closings']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['daily_closings']['Insert']>
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>
        Update: never
      }
    }
    Functions: {
      generate_invoice_number: {
        Args: Record<string, never>
        Returns: string
      }
      finalize_invoice: {
        Args: {
          p_invoice_id: string
          p_payment_method: PaymentMethod
          p_amount_paid: number
          p_user_id: string
        }
        Returns: Json
      }
      get_user_role: {
        Args: Record<string, never>
        Returns: UserRole
      }
    }
  }
}
