export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">About Tekron</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted destination for premium electronics and tech accessories since 2024
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600">
              At Tekron, we're dedicated to providing our customers with the latest and most innovative technology products. We believe that everyone deserves access to high-quality electronics that enhance their daily lives and work.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-600">
              We envision a world where technology seamlessly integrates into people's lives, making everyday tasks more efficient and enjoyable. Through carefully curated products and exceptional service, we aim to be at the forefront of this technological evolution.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Why Choose Tekron?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Quality Products</h3>
              <p className="text-gray-600">
                We carefully select each product to ensure the highest quality and reliability.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
              <p className="text-gray-600">
                Our team of tech experts is always ready to help you make the right choice.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Fast Shipping</h3>
              <p className="text-gray-600">
                Get your products delivered quickly and securely to your doorstep.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Our Story</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Tekron was founded in 2024 with a simple idea: to make premium technology accessible to everyone. What started as a small online store has grown into a trusted destination for tech enthusiasts and professionals alike. We continue to expand our product range while maintaining our commitment to quality and customer satisfaction.
          </p>
        </div>
      </div>
    </div>
  )
} 
