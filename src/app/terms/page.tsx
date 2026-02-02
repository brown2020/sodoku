import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Sudoku",
  description: "Terms of service for the Sudoku game",
};

export default function TermsPage() {
  return (
    <main className="bg-slate-50 py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
          Terms of Service
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
          <p className="text-slate-600 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Acceptance of Terms
            </h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing and using this Sudoku game, you accept and agree to
              be bound by the terms and conditions of this agreement. If you do
              not agree to these terms, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Description of Service
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Sudoku is a free, web-based puzzle game provided for entertainment
              and educational purposes. The game allows users to play Sudoku
              puzzles of varying difficulty levels directly in their web
              browser.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Use of the Service
            </h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              You agree to use this service only for lawful purposes and in
              accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>
                Use the service in any way that violates applicable laws or
                regulations
              </li>
              <li>
                Attempt to interfere with or disrupt the service or servers
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the service
              </li>
              <li>
                Use automated systems or software to extract data from the
                service
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Intellectual Property
            </h2>
            <p className="text-slate-600 leading-relaxed">
              The service and its original content, features, and functionality
              are owned by the developers and are protected by international
              copyright, trademark, and other intellectual property laws. The
              game is released under the MIT License.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Disclaimer of Warranties
            </h2>
            <p className="text-slate-600 leading-relaxed">
              The service is provided on an &quot;as is&quot; and &quot;as
              available&quot; basis without any warranties of any kind, either
              express or implied. We do not warrant that the service will be
              uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Limitation of Liability
            </h2>
            <p className="text-slate-600 leading-relaxed">
              In no event shall the developers be liable for any indirect,
              incidental, special, consequential, or punitive damages arising
              out of or related to your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Changes to Terms
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time.
              It is your responsibility to review these Terms periodically for
              changes. Your continued use of the service following the posting
              of any changes constitutes acceptance of those changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Contact
            </h2>
            <p className="text-slate-600 leading-relaxed">
              If you have any questions about these Terms, please contact us
              through our GitHub repository.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
