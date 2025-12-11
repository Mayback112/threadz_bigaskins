import { CategoryGrid } from '@/component/category-grid';

export function CategoriesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
                <p className="text-muted-foreground text-lg">
                    Browse our premium collection of tailored clothing and accessories
                </p>
            </div>

            {/* Categories Grid - Shows all categories */}
            <CategoryGrid />
        </div>
    );
}
