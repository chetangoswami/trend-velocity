import { getAllProducts } from '../../lib/sanity';

export const dynamic = 'force-dynamic';

export default async function SanityTestPage() {
    const products = await getAllProducts();

    return (
        <div className="p-10 font-sans">
            <h1 className="text-2xl font-bold mb-6">Sanity Connection Test</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold">Status:</h2>
                <p className="flex items-center gap-2">
                    Sanity Client: <span className="text-green-600 font-bold">Initialized</span>
                </p>
                <p>Products Found: {products.length}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.length === 0 ? (
                    <div className="p-4 border rounded bg-gray-50">
                        No products found in Sanity. Connection appears working (queries returned empty list).
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product._id} className="border p-4 rounded shadow-sm">
                            <h3 className="font-bold">{product.title || 'Untitled'}</h3>
                            <p className="text-sm text-gray-500">Medusa ID: {product.medusaId}</p>
                            {product.heroImage && (
                                <div className="mt-2 text-xs text-blue-600">
                                    Image Ref: {product.heroImage.asset._ref}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
