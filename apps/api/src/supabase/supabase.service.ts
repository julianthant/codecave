import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>("SUPABASE_URL");
    const supabaseServiceKey = this.configService.get<string>(
      "SUPABASE_SERVICE_ROLE_KEY"
    );

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase URL and Service Role Key must be provided");
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  async verifySupabaseToken(token: string) {
    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser(token);

      if (error) {
        throw new Error(`Token verification failed: ${error.message}`);
      }

      return user;
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  async getUserFromSupabase(userId: string) {
    try {
      const { data: user, error } =
        await this.supabase.auth.admin.getUserById(userId);

      if (error) {
        throw new Error(`Failed to get user: ${error.message}`);
      }

      return user;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }
}
