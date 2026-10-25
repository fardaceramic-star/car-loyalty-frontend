import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            هرچه بیشتر مراجعه کنید، تخفیف بیشتری بگیرید!
          </h1>
          <p className="text-lg mb-8 opacity-90">تخفیف تا ۲۵٪ + امتیاز رایگان + هدیه تولد</p>
          <Link href="/discounts" className="inline-block bg-accent text-gray-900 font-bold px-8 py-3 rounded-xl">
            مشاهده طرح‌ها
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">چطور کار می‌کند؟</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: 1, t: 'ثبت‌نام رایگان' },
              { n: 2, t: 'هر خرید امتیاز' },
              { n: 3, t: 'سطح بالاتر' },
              { n: 4, t: 'تخفیف بیشتر' },
            ].map((s) => (
              <div key={s.n} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="w-14 h-14 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {s.n}
                </div>
                <h3 className="font-bold text-lg">{s.t}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}