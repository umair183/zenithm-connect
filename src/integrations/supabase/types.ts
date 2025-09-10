export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          announcement_type: string | null
          attachment_path: string | null
          content: string
          created_at: string
          expires_at: string | null
          id: string
          is_pinned: boolean | null
          published_at: string | null
          published_by: string
          target_audience: string | null
          target_department: string | null
          title: string
          updated_at: string
        }
        Insert: {
          announcement_type?: string | null
          attachment_path?: string | null
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_pinned?: boolean | null
          published_at?: string | null
          published_by: string
          target_audience?: string | null
          target_department?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          announcement_type?: string | null
          attachment_path?: string | null
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_pinned?: boolean | null
          published_at?: string | null
          published_by?: string
          target_audience?: string | null
          target_department?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          clock_in: string
          clock_out: string | null
          created_at: string
          date: string
          employee_id: string
          id: string
          total_hours: number | null
          updated_at: string
        }
        Insert: {
          clock_in?: string
          clock_out?: string | null
          created_at?: string
          date?: string
          employee_id: string
          id?: string
          total_hours?: number | null
          updated_at?: string
        }
        Update: {
          clock_in?: string
          clock_out?: string | null
          created_at?: string
          date?: string
          employee_id?: string
          id?: string
          total_hours?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      employee_certifications: {
        Row: {
          certificate_path: string | null
          certification_name: string
          created_at: string
          employee_id: string
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuing_organization: string | null
          status: string | null
          updated_at: string
          verification_url: string | null
        }
        Insert: {
          certificate_path?: string | null
          certification_name: string
          created_at?: string
          employee_id: string
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_organization?: string | null
          status?: string | null
          updated_at?: string
          verification_url?: string | null
        }
        Update: {
          certificate_path?: string | null
          certification_name?: string
          created_at?: string
          employee_id?: string
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_organization?: string | null
          status?: string | null
          updated_at?: string
          verification_url?: string | null
        }
        Relationships: []
      }
      employee_documents: {
        Row: {
          created_at: string
          document_name: string
          document_type: string
          employee_id: string
          file_path: string
          file_size: number | null
          id: string
          updated_at: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          document_name: string
          document_type: string
          employee_id: string
          file_path: string
          file_size?: number | null
          id?: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          document_name?: string
          document_type?: string
          employee_id?: string
          file_path?: string
          file_size?: number | null
          id?: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      employee_recognitions: {
        Row: {
          award_date: string | null
          awarded_by: string
          certificate_path: string | null
          created_at: string
          description: string | null
          employee_id: string
          id: string
          is_public: boolean | null
          monetary_value: number | null
          recognition_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          award_date?: string | null
          awarded_by: string
          certificate_path?: string | null
          created_at?: string
          description?: string | null
          employee_id: string
          id?: string
          is_public?: boolean | null
          monetary_value?: number | null
          recognition_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          award_date?: string | null
          awarded_by?: string
          certificate_path?: string | null
          created_at?: string
          description?: string | null
          employee_id?: string
          id?: string
          is_public?: boolean | null
          monetary_value?: number | null
          recognition_type?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      holidays: {
        Row: {
          created_at: string
          created_by: string
          date: string
          description: string | null
          id: string
          name: string
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          date: string
          description?: string | null
          id?: string
          name: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          date?: string
          description?: string | null
          id?: string
          name?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_email: string
          applicant_name: string
          applicant_phone: string | null
          application_status: string | null
          cover_letter: string | null
          created_at: string
          id: string
          interview_date: string | null
          interview_feedback: string | null
          job_posting_id: string
          resume_path: string | null
          updated_at: string
        }
        Insert: {
          applicant_email: string
          applicant_name: string
          applicant_phone?: string | null
          application_status?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          interview_date?: string | null
          interview_feedback?: string | null
          job_posting_id: string
          resume_path?: string | null
          updated_at?: string
        }
        Update: {
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string | null
          application_status?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          interview_date?: string | null
          interview_feedback?: string | null
          job_posting_id?: string
          resume_path?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          application_deadline: string | null
          created_at: string
          department: string | null
          employment_type: string | null
          id: string
          job_description: string
          location: string | null
          posted_by: string
          requirements: string | null
          salary_range: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          created_at?: string
          department?: string | null
          employment_type?: string | null
          id?: string
          job_description: string
          location?: string | null
          posted_by: string
          requirements?: string | null
          salary_range?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          created_at?: string
          department?: string | null
          employment_type?: string | null
          id?: string
          job_description?: string
          location?: string | null
          posted_by?: string
          requirements?: string | null
          salary_range?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leave_applications: {
        Row: {
          applied_at: string
          approved_by: string | null
          employee_id: string
          end_date: string
          hr_comments: string | null
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string
          start_date: string
          status: Database["public"]["Enums"]["leave_status"]
          updated_at: string
        }
        Insert: {
          applied_at?: string
          approved_by?: string | null
          employee_id: string
          end_date: string
          hr_comments?: string | null
          id?: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"]
          updated_at?: string
        }
        Update: {
          applied_at?: string
          approved_by?: string | null
          employee_id?: string
          end_date?: string
          hr_comments?: string | null
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          reason?: string
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_applications_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "leave_applications_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      leave_balances: {
        Row: {
          created_at: string
          employee_id: string
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          remaining_days: number
          total_days: number
          updated_at: string
          used_days: number
          year: number
        }
        Insert: {
          created_at?: string
          employee_id: string
          id?: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          remaining_days?: number
          total_days?: number
          updated_at?: string
          used_days?: number
          year?: number
        }
        Update: {
          created_at?: string
          employee_id?: string
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          remaining_days?: number
          total_days?: number
          updated_at?: string
          used_days?: number
          year?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          related_id: string | null
          related_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          related_id?: string | null
          related_type?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          related_id?: string | null
          related_type?: string | null
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
            referencedColumns: ["user_id"]
          },
        ]
      }
      payroll: {
        Row: {
          base_salary: number
          bonuses: number
          created_at: string
          deductions: number
          employee_id: string
          generated_at: string
          generated_by: string
          id: string
          late_days: number
          month: number
          net_pay: number
          present_days: number
          updated_at: string
          working_days: number
          year: number
        }
        Insert: {
          base_salary?: number
          bonuses?: number
          created_at?: string
          deductions?: number
          employee_id: string
          generated_at?: string
          generated_by: string
          id?: string
          late_days?: number
          month: number
          net_pay?: number
          present_days?: number
          updated_at?: string
          working_days?: number
          year: number
        }
        Update: {
          base_salary?: number
          bonuses?: number
          created_at?: string
          deductions?: number
          employee_id?: string
          generated_at?: string
          generated_by?: string
          id?: string
          late_days?: number
          month?: number
          net_pay?: number
          present_days?: number
          updated_at?: string
          working_days?: number
          year?: number
        }
        Relationships: []
      }
      performance_reviews: {
        Row: {
          areas_of_improvement: string | null
          created_at: string
          employee_comments: string | null
          employee_id: string
          goals_achieved: string | null
          id: string
          overall_rating: number | null
          review_period_end: string
          review_period_start: string
          reviewer_comments: string | null
          reviewer_id: string
          status: string | null
          training_needs: string | null
          updated_at: string
        }
        Insert: {
          areas_of_improvement?: string | null
          created_at?: string
          employee_comments?: string | null
          employee_id: string
          goals_achieved?: string | null
          id?: string
          overall_rating?: number | null
          review_period_end: string
          review_period_start: string
          reviewer_comments?: string | null
          reviewer_id: string
          status?: string | null
          training_needs?: string | null
          updated_at?: string
        }
        Update: {
          areas_of_improvement?: string | null
          created_at?: string
          employee_comments?: string | null
          employee_id?: string
          goals_achieved?: string | null
          id?: string
          overall_rating?: number | null
          review_period_end?: string
          review_period_start?: string
          reviewer_comments?: string | null
          reviewer_id?: string
          status?: string | null
          training_needs?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bank_account_number: string | null
          bank_name: string | null
          base_salary: number | null
          bio: string | null
          contact_number: string | null
          contract_type: string | null
          created_at: string
          date_of_birth: string | null
          department: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string | null
          full_name: string
          hire_date: string | null
          id: string
          job_title: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: string | null
          tax_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          base_salary?: number | null
          bio?: string | null
          contact_number?: string | null
          contract_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          full_name: string
          hire_date?: string | null
          id?: string
          job_title?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          base_salary?: number | null
          bio?: string | null
          contact_number?: string | null
          contract_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          full_name?: string
          hire_date?: string | null
          id?: string
          job_title?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      salary_components: {
        Row: {
          amount: number
          component_name: string
          component_type: string
          created_at: string
          effective_from: string | null
          effective_to: string | null
          employee_id: string
          id: string
          is_active: boolean | null
          is_percentage: boolean | null
          percentage_of: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          component_name: string
          component_type: string
          created_at?: string
          effective_from?: string | null
          effective_to?: string | null
          employee_id: string
          id?: string
          is_active?: boolean | null
          is_percentage?: boolean | null
          percentage_of?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          component_name?: string
          component_type?: string
          created_at?: string
          effective_from?: string | null
          effective_to?: string | null
          employee_id?: string
          id?: string
          is_active?: boolean | null
          is_percentage?: boolean | null
          percentage_of?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      self_assessments: {
        Row: {
          achievements: string | null
          assessment_period_end: string
          assessment_period_start: string
          challenges_faced: string | null
          created_at: string
          employee_id: string
          goals_for_next_period: string | null
          id: string
          self_rating: number | null
          status: string | null
          submitted_at: string | null
          training_requests: string | null
          updated_at: string
        }
        Insert: {
          achievements?: string | null
          assessment_period_end: string
          assessment_period_start: string
          challenges_faced?: string | null
          created_at?: string
          employee_id: string
          goals_for_next_period?: string | null
          id?: string
          self_rating?: number | null
          status?: string | null
          submitted_at?: string | null
          training_requests?: string | null
          updated_at?: string
        }
        Update: {
          achievements?: string | null
          assessment_period_end?: string
          assessment_period_start?: string
          challenges_faced?: string | null
          created_at?: string
          employee_id?: string
          goals_for_next_period?: string | null
          id?: string
          self_rating?: number | null
          status?: string | null
          submitted_at?: string | null
          training_requests?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          created_at: string
          employee_id: string | null
          id: string
          responses: Json
          submitted_at: string
          survey_id: string
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          id?: string
          responses: Json
          submitted_at?: string
          survey_id: string
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          id?: string
          responses?: Json
          submitted_at?: string
          survey_id?: string
        }
        Relationships: []
      }
      surveys: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          id: string
          is_anonymous: boolean | null
          questions: Json
          start_date: string | null
          status: string | null
          survey_type: string | null
          target_audience: string | null
          target_department: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_anonymous?: boolean | null
          questions: Json
          start_date?: string | null
          status?: string | null
          survey_type?: string | null
          target_audience?: string | null
          target_department?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_anonymous?: boolean | null
          questions?: Json
          start_date?: string | null
          status?: string | null
          survey_type?: string | null
          target_audience?: string | null
          target_department?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_submissions: {
        Row: {
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          comment: string | null
          created_at: string
          employee_id: string
          file_name: string | null
          file_url: string | null
          hr_feedback: string | null
          id: string
          submitted_at: string
          task_id: string
          updated_at: string
        }
        Insert: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          comment?: string | null
          created_at?: string
          employee_id: string
          file_name?: string | null
          file_url?: string | null
          hr_feedback?: string | null
          id?: string
          submitted_at?: string
          task_id: string
          updated_at?: string
        }
        Update: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          comment?: string | null
          created_at?: string
          employee_id?: string
          file_name?: string | null
          file_url?: string | null
          hr_feedback?: string | null
          id?: string
          submitted_at?: string
          task_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_by: string
          assigned_to: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_by: string
          assigned_to: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          assigned_to?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      training_enrollments: {
        Row: {
          certificate_issued: boolean | null
          certificate_path: string | null
          completion_date: string | null
          employee_id: string
          enrolled_at: string
          enrollment_status: string | null
          feedback: string | null
          grade: string | null
          id: string
          training_program_id: string
          updated_at: string
        }
        Insert: {
          certificate_issued?: boolean | null
          certificate_path?: string | null
          completion_date?: string | null
          employee_id: string
          enrolled_at?: string
          enrollment_status?: string | null
          feedback?: string | null
          grade?: string | null
          id?: string
          training_program_id: string
          updated_at?: string
        }
        Update: {
          certificate_issued?: boolean | null
          certificate_path?: string | null
          completion_date?: string | null
          employee_id?: string
          enrolled_at?: string
          enrollment_status?: string | null
          feedback?: string | null
          grade?: string | null
          id?: string
          training_program_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_programs: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          duration_hours: number | null
          end_date: string | null
          id: string
          location: string | null
          materials_path: string | null
          max_participants: number | null
          start_date: string | null
          status: string | null
          title: string
          trainer_name: string | null
          training_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          duration_hours?: number | null
          end_date?: string | null
          id?: string
          location?: string | null
          materials_path?: string | null
          max_participants?: number | null
          start_date?: string | null
          status?: string | null
          title: string
          trainer_name?: string | null
          training_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          duration_hours?: number | null
          end_date?: string | null
          id?: string
          location?: string | null
          materials_path?: string | null
          max_participants?: number | null
          start_date?: string | null
          status?: string | null
          title?: string
          trainer_name?: string | null
          training_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          notification_message: string
          notification_title: string
          notification_type?: string
          recipient_id: string
          ref_id?: string
          ref_type?: string
        }
        Returns: string
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_hr_user: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      leave_status: "pending" | "approved" | "rejected"
      leave_type: "sick" | "vacation" | "personal" | "emergency"
      task_status: "pending" | "in_progress" | "completed"
      user_role: "hr" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      leave_status: ["pending", "approved", "rejected"],
      leave_type: ["sick", "vacation", "personal", "emergency"],
      task_status: ["pending", "in_progress", "completed"],
      user_role: ["hr", "employee"],
    },
  },
} as const
