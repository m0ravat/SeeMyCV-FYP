import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getProduct } from '@/lib/products';
import { verifySession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Already premium — no need to checkout
    if (session.isPremium) {
      return NextResponse.json({ error: 'Already premium' }, { status: 400 });
    }

    const { productId } = await request.json();
    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const checkoutSession = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency,
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
        productId: product.id,
      },
      return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: checkoutSession.client_secret });
  } catch (error) {
    console.error('[v0] Stripe checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
