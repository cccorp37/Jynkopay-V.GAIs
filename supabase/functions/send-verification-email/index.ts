import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  code: string;
  type: "signup" | "login";
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code, type }: VerificationRequest = await req.json();

    if (!email || !code) {
      throw new Error("Email and code are required");
    }

    const subject = type === "signup" 
      ? "Vérifiez votre email - Jynkopay"
      : "Code de connexion - Jynkopay";

    const html = type === "signup" 
      ? `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0A0E27; color: #ffffff; padding: 40px; }
            .container { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, rgba(21,25,50,0.95), rgba(108,63,245,0.1)); border-radius: 24px; padding: 40px; border: 1px solid rgba(108,63,245,0.3); }
            .logo { text-align: center; margin-bottom: 30px; }
            .logo span { font-size: 28px; font-weight: bold; }
            .logo .primary { color: #ffffff; }
            .logo .accent { background: linear-gradient(135deg, #6C3FF5, #00E5FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            h1 { font-size: 24px; text-align: center; margin-bottom: 20px; }
            p { color: #9CA3AF; line-height: 1.6; text-align: center; }
            .code-box { background: linear-gradient(135deg, #6C3FF5, #5B2FE5); border-radius: 16px; padding: 20px; text-align: center; margin: 30px 0; }
            .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #ffffff; font-family: 'Courier New', monospace; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(108,63,245,0.2); }
            .footer p { font-size: 12px; color: #6B7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <span class="primary">Geck</span><span class="accent">Avy</span>
            </div>
            <h1>Vérifiez votre email</h1>
            <p>Bienvenue sur Jynkopay ! Utilisez le code ci-dessous pour vérifier votre adresse email et activer votre compte.</p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            <p>Ce code expire dans 15 minutes.</p>
            <div class="footer">
              <p>Si vous n'avez pas créé de compte Jynkopay, ignorez cet email.</p>
            </div>
          </div>
        </body>
        </html>
      `
      : `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0A0E27; color: #ffffff; padding: 40px; }
            .container { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, rgba(21,25,50,0.95), rgba(108,63,245,0.1)); border-radius: 24px; padding: 40px; border: 1px solid rgba(108,63,245,0.3); }
            .logo { text-align: center; margin-bottom: 30px; }
            .logo span { font-size: 28px; font-weight: bold; }
            .logo .primary { color: #ffffff; }
            .logo .accent { background: linear-gradient(135deg, #6C3FF5, #00E5FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            h1 { font-size: 24px; text-align: center; margin-bottom: 20px; }
            p { color: #9CA3AF; line-height: 1.6; text-align: center; }
            .code-box { background: linear-gradient(135deg, #FFD700, #FFB84D); border-radius: 16px; padding: 20px; text-align: center; margin: 30px 0; }
            .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0A0E27; font-family: 'Courier New', monospace; }
            .security { background: rgba(0,200,150,0.1); border: 1px solid rgba(0,200,150,0.3); border-radius: 12px; padding: 15px; margin: 20px 0; }
            .security p { color: #00C896; font-size: 13px; margin: 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(108,63,245,0.2); }
            .footer p { font-size: 12px; color: #6B7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <span class="primary">Geck</span><span class="accent">Avy</span>
            </div>
            <h1>Code de connexion</h1>
            <p>Voici votre code de vérification pour vous connecter à Jynkopay.</p>
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            <div class="security">
              <p>🔒 Ne partagez jamais ce code avec personne. Jynkopay ne vous demandera jamais votre code par téléphone.</p>
            </div>
            <p>Ce code expire dans 10 minutes.</p>
            <div class="footer">
              <p>Si vous n'avez pas demandé ce code, sécurisez immédiatement votre compte.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    // Use Resend API directly via fetch
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Jynkopay <onboarding@resend.dev>",
        to: [email],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailResponse = await response.json();
    console.log("Verification email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending verification email:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
