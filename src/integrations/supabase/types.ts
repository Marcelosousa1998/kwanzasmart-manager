export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      drivers: {
        Row: {
          address: string
          created_at: string
          created_by: string
          full_name: string
          id: string
          identity_doc_url: string | null
          identity_number: string
          license_doc_url: string | null
          license_number: string
          photo_url: string | null
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          created_by: string
          full_name: string
          id?: string
          identity_doc_url?: string | null
          identity_number: string
          license_doc_url?: string | null
          license_number: string
          photo_url?: string | null
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          created_by?: string
          full_name?: string
          id?: string
          identity_doc_url?: string | null
          identity_number?: string
          license_doc_url?: string | null
          license_number?: string
          photo_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drivers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_records: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string
          date: string
          description: string
          id: string
          receipt_url: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          type: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          created_by: string
          date: string
          description: string
          id?: string
          receipt_url?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          type: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string
          date?: string
          description?: string
          id?: string
          receipt_url?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          cost: number
          created_at: string
          created_by: string
          date: string
          description: string
          id: string
          mechanic_name: string | null
          part_count: number | null
          parts_replaced: string | null
          receipt_url: string | null
          type: string
          vehicle_id: string
        }
        Insert: {
          cost: number
          created_at?: string
          created_by: string
          date: string
          description: string
          id?: string
          mechanic_name?: string | null
          part_count?: number | null
          parts_replaced?: string | null
          receipt_url?: string | null
          type: string
          vehicle_id: string
        }
        Update: {
          cost?: number
          created_at?: string
          created_by?: string
          date?: string
          description?: string
          id?: string
          mechanic_name?: string | null
          part_count?: number | null
          parts_replaced?: string | null
          receipt_url?: string | null
          type?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          phone: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          created_by: string
          end_date: string
          file_url: string
          id: string
          period: string
          start_date: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by: string
          end_date: string
          file_url: string
          id?: string
          period: string
          start_date: string
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string
          end_date?: string
          file_url?: string
          id?: string
          period?: string
          start_date?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_status: {
        Row: {
          created_at: string
          created_by: string
          departure_condition: string
          departure_time: string
          driver_id: string
          id: string
          return_condition: string | null
          return_time: string | null
          status: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          departure_condition: string
          departure_time?: string
          driver_id: string
          id?: string
          return_condition?: string | null
          return_time?: string | null
          status?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          departure_condition?: string
          departure_time?: string
          driver_id?: string
          id?: string
          return_condition?: string | null
          return_time?: string | null
          status?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_status_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_status_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_status_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          assigned_driver_id: string | null
          brand: string
          condition: string
          created_at: string
          created_by: string
          id: string
          last_inspection: string | null
          license_plate: string
          model: string
          next_maintenance_date: string | null
          status: string
          year: number
        }
        Insert: {
          assigned_driver_id?: string | null
          brand: string
          condition: string
          created_at?: string
          created_by: string
          id?: string
          last_inspection?: string | null
          license_plate: string
          model: string
          next_maintenance_date?: string | null
          status?: string
          year: number
        }
        Update: {
          assigned_driver_id?: string | null
          brand?: string
          condition?: string
          created_at?: string
          created_by?: string
          id?: string
          last_inspection?: string | null
          license_plate?: string
          model?: string
          next_maintenance_date?: string | null
          status?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_assigned_driver_id_fkey"
            columns: ["assigned_driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role: "admin" | "admin_secondary" | "driver"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
