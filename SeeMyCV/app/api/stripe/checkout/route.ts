import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifySession } from '@/lib/auth';
import { getProduct } from '@/lib/products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CheckoutRequest {
  productId: string;
}

interface CheckoutResponse {
  clientSecret?: string;
  error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<CheckoutResponse>> {
  try {
    // Verify user is authenticated
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if already premium
    if (session.isPremium) {
      return NextResponse.json(
        { error: 'Already premium' },
        { status: 400 }
      );
    }

    // Parse request body
    let body: CheckoutRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { productId } = body;

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get product details
    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Get origin for return URL
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency.toLowerCase(),
            unit_amount: product.priceInCents,
            product_data: {
              name: product.name,
              description: product.description,
            },
          },
        },
      ],
      metadata: {
        userId: String(session.userId),
        productId: productId,
      },
      return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    // Verify client secret exists
    if (!checkoutSession.client_secret) {
      console.error('Stripe session created without client_secret:', checkoutSession);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        clientSecret: checkoutSession.client_secret,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Checkout error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}