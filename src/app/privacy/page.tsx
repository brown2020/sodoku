import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Sudoku",
  description: "Privacy policy for the Sudoku game",
};

export default function PrivacyPage() {
  return (
    <main className="bg-slate-50 py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
          Privacy Policy
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
          <p className="text-slate-600 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Introduction
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Welcome to Sudoku. We respect your privacy and are committed to
              protecting any information you may provide while using our game.
              This Privacy Policy explains our practices regarding data
              collection and usage.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Information We Collect
            </h2>
            <p className="text-slate-600 leading-relaxed">
              This Sudoku game is designed to be privacy-friendly. We do not
              collect, store, or transmit any personal information. All game
              data, including your progress and settings, is stored locally in
              your browser and is not sent to any external servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Local Storage
            </h2>
            <p className="text-slate-600 leading-relaxed">
              The game may use your browser&apos;s local storage to save game
              state temporarily during a session. This data remains on your
              device and is not accessible to us or any third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Cookies
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We do not use cookies for tracking or advertising purposes. Any
              cookies that may be present are strictly necessary for the
              technical operation of the website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Third-Party Services
            </h2>
            <p className="text-slate-600 leading-relaxed">
              This game does not integrate with third-party analytics, social
              media, or advertising services that would collect your personal
              information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Changes to This Policy
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Contact
            </h2>
            <p className="text-slate-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us through our GitHub repository.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
