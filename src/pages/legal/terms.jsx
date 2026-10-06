import { Link } from "react-router-dom";

function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
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

      <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
            Legal
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Terms & Conditions
          </h1>

          <p className="mt-4 text-sm text-slate-500">
            Last updated: October 2026
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <section>
            <h2 className="text-xl font-bold text-slate-900">
              1. Acceptance of Terms
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              By accessing or using the Employee Management System and People
              Portal, you agree to follow these Terms & Conditions. If you do
              not agree with these terms, please do not use the system.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              2. Account Responsibility
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Users are responsible for maintaining the confidentiality of
              their account credentials and for all activity performed using
              their account. Accounts must only be used by authorized users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              3. Acceptable Use
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              The system must be used for legitimate employee-management
              activities including attendance, leave management, task
              tracking, performance management, reporting, and related
              workforce operations.
            </p>

            <p className="mt-3 leading-7 text-slate-600">
              Users must not attempt to gain unauthorized access, interfere
              with system operation, misuse employee information, or submit
              false or malicious information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              4. Employee Information
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Information entered into the system should be accurate and
              provided only for authorized employment and workforce-management
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              5. Attendance and Records
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Attendance, leave, task, performance, and other records should
              be entered and managed accurately. Authorized administrators and
              managers may review or update information according to their
              assigned permissions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              6. System Availability
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Reasonable efforts may be made to keep the system available and
              functional. Temporary interruptions may occur because of
              maintenance, technical issues, network problems, or other
              circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              7. Changes to These Terms
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              These Terms & Conditions may be updated when system features,
              policies, or operational requirements change. Updated terms may
              be published on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              8. Contact
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              For questions regarding the Employee Management System, please
              contact the responsible organization or system administrator.
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

export default Terms;