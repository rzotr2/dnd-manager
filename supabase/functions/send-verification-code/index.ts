
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = "https://avgaqbmowxatdbmxrikv.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface VerificationRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: VerificationRequest = await req.json();

    // Generate verification code
    const { data: codeData, error: codeError } = await supabase
      .rpc('generate_verification_code');

    if (codeError) throw codeError;

    const verificationCode = codeData;

    // Clean up old codes for this email
    await supabase
      .from('email_verification_codes')
      .delete()
      .eq('email', email);

    // Store new verification code
    const { error: insertError } = await supabase
      .from('email_verification_codes')
      .insert({
        email,
        code: verificationCode,
      });

    if (insertError) throw insertError;

    // Here you would integrate with your email service (Resend, etc.)
    // For now, we'll just log the code (in production, send via email)
    console.log(`Verification code for ${email}: ${verificationCode}`);

    return new Response(
      JSON.stringify({ success: true, message: "Verification code sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending verification code:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
