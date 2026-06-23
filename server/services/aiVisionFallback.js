/**
 * AI Vision Fallback Service using GPT-4o or Claude 3.5 Sonnet
 */

/**
 * Classifies document using OpenAI or Anthropic Vision APIs.
 * @param {object} params
 * @param {string} [params.imageBase64] base64 encoded first page image
 * @param {string} [params.text] OCR extracted text
 * @param {string} params.expectedType GST | PAN | COMPANY_REG
 * @returns {Promise<object>} JSON response from classification
 */
export async function classifyDocumentWithAI({ imageBase64, text, expectedType }) {
  const openAIKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

  if (openAIKey) {
    try {
      console.log("[AIVisionFallback] Routing to OpenAI GPT-4o...");
      return await callOpenAIVision(openAIKey, imageBase64, text, expectedType);
    } catch (err) {
      console.error("[AIVisionFallback] OpenAI API call failed:", err);
      // Fallback to Anthropic if configured, else throw or mock
      if (anthropicKey) {
        console.log("[AIVisionFallback] Retrying with Anthropic Claude...");
        return await callAnthropicVision(anthropicKey, imageBase64, text, expectedType);
      }
      throw err;
    }
  } else if (anthropicKey) {
    console.log("[AIVisionFallback] Routing to Anthropic Claude 3.5 Sonnet...");
    return await callAnthropicVision(anthropicKey, imageBase64, text, expectedType);
  } else {
    console.warn("[AIVisionFallback] Neither OpenAI nor Anthropic API keys configured. Using simulated AI response.");
    return mockAIVisionFallback(text, expectedType);
  }
}

/**
 * OpenAI vision integration helper
 */
async function callOpenAIVision(apiKey, imageBase64, text, expectedType) {
  const expectedTypeMap = {
    GST: "GST_CERTIFICATE",
    PAN: "PAN_CARD",
    COMPANY_REG: "COMPANY_REGISTRATION"
  };

  const prompt = `Classify this document. Respond ONLY with JSON, no other text:
{
  "detected_type": "GST_CERTIFICATE" | "PAN_CARD" | "COMPANY_REGISTRATION" | "OTHER" | "UNREADABLE",
  "confidence": 0.0-1.0,
  "matches_expected_type": true | false,
  "reason": "short explanation"
}
Expected type: ${expectedTypeMap[expectedType] || expectedType}`;

  const content = [];
  content.push({ type: "text", text: prompt });

  if (imageBase64) {
    const formattedBase64 = imageBase64.startsWith("data:") 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`;
    content.push({
      type: "image_url",
      image_url: { url: formattedBase64 }
    });
  }

  if (text) {
    content.push({ type: "text", text: `Extracted OCR text:\n${text}` });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content }],
      response_format: { type: "json_object" },
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`OpenAI HTTP ${response.status} - ${errBody}`);
  }

  const payload = await response.json();
  const contentStr = payload.choices?.[0]?.message?.content;
  if (!contentStr) throw new Error("Empty completion from OpenAI");

  return JSON.parse(contentStr);
}

/**
 * Anthropic Claude vision integration helper
 */
async function callAnthropicVision(apiKey, imageBase64, text, expectedType) {
  const expectedTypeMap = {
    GST: "GST_CERTIFICATE",
    PAN: "PAN_CARD",
    COMPANY_REG: "COMPANY_REGISTRATION"
  };

  const prompt = `Classify this document. Respond ONLY with JSON, no other text:
{
  "detected_type": "GST_CERTIFICATE" | "PAN_CARD" | "COMPANY_REGISTRATION" | "OTHER" | "UNREADABLE",
  "confidence": 0.0-1.0,
  "matches_expected_type": true | false,
  "reason": "short explanation"
}
Expected type: ${expectedTypeMap[expectedType] || expectedType}`;

  const content = [];

  if (imageBase64) {
    const rawBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    // Extract mime type (e.g. data:image/png;base64 -> image/png)
    let mediaType = "image/jpeg";
    const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    if (mimeMatch) {
      mediaType = mimeMatch[1];
    }
    
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: mediaType,
        data: rawBase64
      }
    });
  }

  if (text) {
    content.push({ type: "text", text: `Extracted OCR text:\n${text}` });
  }

  content.push({ type: "text", text: prompt });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [{ role: "user", content }],
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Anthropic HTTP ${response.status} - ${errBody}`);
  }

  const payload = await response.json();
  const textContent = payload.content?.[0]?.text;
  if (!textContent) throw new Error("Empty message from Anthropic");

  const jsonMatch = textContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to find JSON in Anthropic output: " + textContent);

  return JSON.parse(jsonMatch[0]);
}

/**
 * Local simulation of AI classification when credentials are not configured.
 */
function mockAIVisionFallback(text, expectedType) {
  const clean = (text || "").toLowerCase();
  
  let detectedType = "OTHER";
  let reason = "AI fallback simulation triggered (no credentials provided).";
  
  // Require multiple core terms to reduce false positives for mock AI classification
  const hasGstKeywords = (clean.includes("gst") || clean.includes("goods and services")) && 
                         (clean.includes("certificate") || clean.includes("registration") || clean.includes("government"));
                         
  const hasPanKeywords = (clean.includes("permanent account") || clean.includes("income tax")) && 
                         (clean.includes("card") || clean.includes("number"));
                         
  const hasRegKeywords = (clean.includes("incorporation") || clean.includes("registrar") || clean.includes("corporate identity")) && 
                         (clean.includes("certificate") || clean.includes("company") || clean.includes("cin"));

  if (hasGstKeywords) {
    detectedType = "GST_CERTIFICATE";
  } else if (hasPanKeywords) {
    detectedType = "PAN_CARD";
  } else if (hasRegKeywords) {
    detectedType = "COMPANY_REGISTRATION";
  }

  const expectedTypeMap = {
    GST: "GST_CERTIFICATE",
    PAN: "PAN_CARD",
    COMPANY_REG: "COMPANY_REGISTRATION"
  };

  const expectedVal = expectedTypeMap[expectedType];
  const isMatch = detectedType === expectedVal;

  return {
    detected_type: detectedType,
    confidence: isMatch ? 0.95 : 0.85,
    matches_expected_type: isMatch,
    reason: isMatch
      ? `Simulated AI matches expected type: ${expectedVal}.`
      : `Simulated AI mismatch: detected ${detectedType} but expected ${expectedVal}.`
  };
}
