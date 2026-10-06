import { Link } from "react-router-dom";

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 font-black text-white">
              E
            </div>

            <div>
              <p className="font-bold text-slate-900">
                Employee Management System
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
                People Portal
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="text-sm font-semibold text-slate-500 transition hover:text-orange-600"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
            Legal
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-slate-500">
            Last updated: October 2026
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <section>
            <h2 className="text-xl font-bold text-slate-900">
              1. Information We Collect
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              The Employee Management System may collect information needed
              for employee-management functions, such as name, email address,
              employee details, attendance information, leave records, tasks,
              performance information, and account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              2. How Information Is Used
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Information may be used to provide employee-management
              services, authenticate users, maintain employee records,
              process attendance and leave information, manage tasks,
              generate reports, and support administrative operations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              3. Account Security
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Users should keep their passwords and authentication information
              private. Security controls and authentication mechanisms may be
              used to protect accounts and system data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              4. Data Access
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Access to employee information should be limited according to
              user roles and system permissions. Administrators, managers, and
              employees may have different levels of access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              5. Data Sharing
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Employee information should not be intentionally shared with
              unauthorized individuals. Information may be accessed by
              authorized personnel when required for legitimate workforce
              operations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              6. Data Retention
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Information may be retained for as long as reasonably necessary
              to support employee-management functions, organizational
              requirements, and applicable record-keeping practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              7. Changes to This Policy
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              This Privacy Policy may be updated as the system, organization,
              or data-handling practices change. Updated information will be
              published on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              8. Contact
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Privacy-related questions may be directed to the responsible
              organization or system administrator.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center text-xs text-slate-400">
          SHNOOR INTERNATIONAL LLC · Employee Management System
        </div>
      </main>
    </div>
  );
}

export default PrivacyPolicy;