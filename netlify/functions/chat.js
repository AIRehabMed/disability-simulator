// Netlify Function to proxy Anthropic API calls securely
// Save this as: netlify/functions/chat.js

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  // Parse the request body
  const { messages, system } = JSON.parse(event.body);

  try {
    // Call Anthropic API with your secret key (stored in environment variable)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // Stored securely in Netlify
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: system,
        messages: messages
      })
    });

    const data = await response.json();

    // Return the response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Allows your frontend to call this
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get response' })
    };
  }
};
