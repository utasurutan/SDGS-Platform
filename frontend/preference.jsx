import { useState, useRef, useEffect } from "react";
import "./preference.css";
import posterPref from "../Assets/Picture/Poster Pref.png";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const DAYS_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

/**
 * Solar Pen New Square Broken Icon matching the reference design header
 */
function SolarEditSquareIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="#1E6AFF" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.996 11.5c-.015 3.541-.129 5.378-1.289 6.538-1.464 1.464-3.822 1.464-8.536 1.464s-7.071 0-8.535-1.464c-1.465-1.465-1.465-3.822-1.465-8.536s0-7.071 1.465-8.535c1.16-1.16 2.997-1.274 6.538-1.289" />
        <path d="M16.02 3.018a2.121 2.121 0 0 1 3 3L11.232 13.8a4 4 0 0 1-1.602 1.002l-2.43.766a.5.5 0 0 1-.624-.624l.766-2.43a4 4 0 0 1 1.002-1.602L16.02 3.018Z" />
        <path d="M14.5 4.5l3 3" />
      </g>
    </svg>
  );
}

/**
 * Male Symbol Icon (Mars) in signature blue
 */
function MaleIcon({ className }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1E6AFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10" cy="14" r="5" />
      <line x1="13.5" y1="10.5" x2="20" y2="4" />
      <polyline points="15 4 20 4 20 9" />
    </svg>
  );
}

/**
 * Female Symbol Icon (Venus) in signature coral
 */
function FemaleIcon({ className }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#EF4444"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="9.5" r="5" />
      <line x1="12" y1="14.5" x2="12" y2="21" />
      <line x1="8.5" y1="17.5" x2="15.5" y2="17.5" />
    </svg>
  );
}

/**
 * Custom UI/UX DatePicker Component
 * Delivers a premium, localized, and intuitive calendar picker experience
 */
function CustomDatePicker({ value, onChange, placeholder = "Masukkan Kelahiranmu" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial date or default to year 2005 for typical onboarding
  const parsed = (() => {
    if (!value) return null;
    const parts = value.split("-");
    if (parts.length === 3) {
      return {
        year: parseInt(parts[0], 10),
        month: parseInt(parts[1], 10) - 1,
        day: parseInt(parts[2], 10),
      };
    }
    return null;
  })();

  const [viewYear, setViewYear] = useState(() => parsed?.year || 2005);
  const [viewMonth, setViewMonth] = useState(() => (parsed ? parsed.month : 2)); // default March 2005

  // Update view when value changes from external
  useEffect(() => {
    if (parsed) {
      setViewYear(parsed.year);
      setViewMonth(parsed.month);
    }
  }, [value]);

  // Click outside listener to dismiss calendar popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (cell, e) => {
    e.stopPropagation();
    const y = cell.year;
    const m = String(cell.month + 1).padStart(2, "0");
    const d = String(cell.day).padStart(2, "0");
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
  };

  const handleSelectToday = (e) => {
    e.stopPropagation();
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    onChange(`${y}-${m}-${d}`);
    setViewYear(y);
    setViewMonth(today.getMonth());
    setIsOpen(false);
  };

  // Generate Year options from current year down to 1940
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear; y >= 1940; y--) {
    yearOptions.push(y);
  }

  // Calculate calendar grid days
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonthIdx = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYearVal = viewMonth === 0 ? viewYear - 1 : viewYear;
    calendarDays.push({
      day,
      month: prevMonthIdx,
      year: prevYearVal,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true,
    });
  }

  // Next month leading days to complete grid (42 days total)
  const remaining = 42 - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    const nextMonthIdx = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYearVal = viewMonth === 11 ? viewYear + 1 : viewYear;
    calendarDays.push({
      day: d,
      month: nextMonthIdx,
      year: nextYearVal,
      isCurrentMonth: false,
    });
  }

  // Formatted display text
  const displayValue = (() => {
    if (!parsed) return "";
    return `${parsed.day} ${MONTHS_ID[parsed.month]} ${parsed.year}`;
  })();

  const isToday = (cell) => {
    const t = new Date();
    return (
      cell.day === t.getDate() &&
      cell.month === t.getMonth() &&
      cell.year === t.getFullYear()
    );
  };

  const isSelected = (cell) => {
    if (!parsed) return false;
    return (
      cell.day === parsed.day &&
      cell.month === parsed.month &&
      cell.year === parsed.year
    );
  };

  return (
    <div className="custom-datepicker-container" ref={containerRef}>
      {/* Input Display Trigger */}
      <div
        className={`pref-date-input-box ${isOpen ? "focused" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
      >
        <span className={displayValue ? "pref-date-val" : "pref-date-placeholder"}>
          {displayValue || placeholder}
        </span>

        <div className="pref-date-actions">
          {displayValue && (
            <button
              type="button"
              className="pref-date-clear-btn"
              onClick={handleClear}
              aria-label="Hapus tanggal"
            >
              <X size={15} />
            </button>
          )}
          <button
            type="button"
            className="pref-date-btn"
            aria-label="Buka kalender"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
          >
            <CalendarIcon size={18} />
          </button>
        </div>
      </div>

      {/* Modern Floating Calendar Popover */}
      {isOpen && (
        <div className="custom-datepicker-popover" role="dialog" aria-label="Pilih Tanggal">
          {/* Header: Month & Year Selectors with Quick Arrows */}
          <div className="cdp-header">
            <div className="cdp-selectors">
              {/* Month Dropdown */}
              <div className="cdp-select-wrap">
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                  className="cdp-select"
                  aria-label="Pilih Bulan"
                >
                  {MONTHS_ID.map((name, idx) => (
                    <option key={name} value={idx}>
                      {name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="cdp-select-arrow" />
              </div>

              {/* Year Dropdown */}
              <div className="cdp-select-wrap">
                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                  className="cdp-select"
                  aria-label="Pilih Tahun"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="cdp-select-arrow" />
              </div>
            </div>

            {/* Prev & Next Month Nav */}
            <div className="cdp-nav-btns">
              <button
                type="button"
                className="cdp-arrow-btn"
                onClick={handlePrevMonth}
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                className="cdp-arrow-btn"
                onClick={handleNextMonth}
                aria-label="Bulan berikutnya"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="cdp-weekdays">
            {DAYS_ID.map((d) => (
              <span key={d} className="cdp-weekday">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="cdp-days-grid">
            {calendarDays.map((cell, idx) => {
              const selected = isSelected(cell);
              const today = isToday(cell);

              let classNames = "cdp-day-btn";
              if (!cell.isCurrentMonth) classNames += " other-month";
              if (today) classNames += " is-today";
              if (selected) classNames += " is-selected";

              return (
                <button
                  key={`${cell.year}-${cell.month}-${cell.day}-${idx}`}
                  type="button"
                  className={classNames}
                  onClick={(e) => handleSelectDay(cell, e)}
                  aria-pressed={selected}
                >
                  <span>{cell.day}</span>
                </button>
              );
            })}
          </div>

          {/* Footer Quick Actions */}
          <div className="cdp-footer">
            <button
              type="button"
              className="cdp-footer-btn clear-btn"
              onClick={handleClear}
            >
              Hapus
            </button>
            <div className="cdp-footer-right">
              <button
                type="button"
                className="cdp-footer-btn today-btn"
                onClick={handleSelectToday}
              >
                Hari ini
              </button>
              <button
                type="button"
                className="cdp-footer-btn done-btn"
                onClick={() => setIsOpen(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PreferencePage({ onNavigate }) {
  const [formData, setFormData] = useState({
    birthDate: "",
    weight: "",
    height: "",
    gender: "",
    activityLevel: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleGenderSelect = (gender) => {
    setFormData((prev) => ({
      ...prev,
      gender: prev.gender === gender ? "" : gender,
    }));
    setValidationError("");
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setValidationError("");
  };

  const handleDateChange = (dateStr) => {
    setFormData((prev) => ({
      ...prev,
      birthDate: dateStr,
    }));
    setValidationError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.birthDate) {
      setValidationError("Silakan masukkan tanggal lahir kamu.");
      return;
    }
    if (!formData.weight) {
      setValidationError("Silakan masukkan berat badan kamu.");
      return;
    }
    if (!formData.height) {
      setValidationError("Silakan masukkan tinggi badan kamu.");
      return;
    }
    if (!formData.gender) {
      setValidationError("Silakan pilih jenis kelamin kamu.");
      return;
    }
    if (!formData.activityLevel) {
      setValidationError("Silakan pilih tingkat aktivitas harian kamu.");
      return;
    }

    setValidationError("");
    console.log("Preference Data Submitted:", formData);
    setIsSuccess(true);
  };

  const handleLinkClick = (e, path) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className="pref-wrapper">
      <main className="pref-container">
        {/* Sisi Kiri: Poster Visual Poster Pref */}
        <section className="pref-left" aria-label="Visual Poster Preferensi">
          <div className="pref-poster-box">
            <img
              src={posterPref}
              alt="Mengenali Sinyal Tubuhmu Sebelum Rasa Cemas Mengambil Alih"
            />
          </div>
        </section>

        {/* Sisi Kanan: Formulir Lengkapi Data Ini */}
        <section className="pref-right" aria-label="Formulir Lengkapi Data">
          {/* Header */}
          <div className="pref-header">
            <SolarEditSquareIcon className="pref-header-icon" />
            <div className="pref-header-text">
              <h1>Lengkapi Data Ini</h1>
              <p>Lengkapi data-data dibawah ini agar kami bisa mengenali kamu</p>
            </div>
          </div>

          {/* Validation Notice */}
          {validationError && (
            <div className="pref-error-banner" role="alert">
              <span>{validationError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Field 1: Tanggal Lahir (Custom Premium UI/UX Calendar) */}
            <div className="pref-input-group">
              <label htmlFor="birthDate">
                Tanggal Lahir<span className="required">*</span>
              </label>
              <CustomDatePicker
                value={formData.birthDate}
                onChange={handleDateChange}
                placeholder="Masukkan Kelahiranmu"
              />
            </div>

            {/* Field 2: Berat Badan */}
            <div className="pref-input-group">
              <label htmlFor="weight">
                Berat Badan<span className="required">*</span>
              </label>
              <div className="pref-suffix-wrapper">
                <input
                  type="number"
                  id="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="-"
                  min="20"
                  max="300"
                  step="0.1"
                  required
                />
                <span className="pref-suffix">kg</span>
              </div>
            </div>

            {/* Field 3: Tinggi Badan */}
            <div className="pref-input-group">
              <label htmlFor="height">
                Tinggi Badan<span className="required">*</span>
              </label>
              <div className="pref-suffix-wrapper">
                <input
                  type="number"
                  id="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="-"
                  min="50"
                  max="260"
                  step="1"
                  required
                />
                <span className="pref-suffix">cm</span>
              </div>
            </div>

            {/* Field 4: Jenis Kelamin */}
            <div className="pref-input-group">
              <label>
                Jenis Kelamin<span className="required">*</span>
              </label>
              <div className="pref-gender-row">
                <button
                  type="button"
                  className={`pref-gender-btn ${
                    formData.gender === "laki-laki" ? "active-male" : ""
                  }`}
                  onClick={() => handleGenderSelect("laki-laki")}
                  aria-pressed={formData.gender === "laki-laki"}
                >
                  <span className="pref-gender-label">Laki-Laki</span>
                  <MaleIcon className="pref-gender-icon" />
                </button>

                <button
                  type="button"
                  className={`pref-gender-btn ${
                    formData.gender === "perempuan" ? "active-female" : ""
                  }`}
                  onClick={() => handleGenderSelect("perempuan")}
                  aria-pressed={formData.gender === "perempuan"}
                >
                  <span className="pref-gender-label">Perempuan</span>
                  <FemaleIcon className="pref-gender-icon" />
                </button>
              </div>
            </div>

            {/* Field 5: Tingkat Aktivitas */}
            <div className="pref-input-group">
              <label htmlFor="activityLevel">
                Tingkat Aktivitas<span className="required">*</span>
              </label>
              <div className="pref-select-wrapper">
                <select
                  id="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleInputChange}
                  className={!formData.activityLevel ? "placeholder-selected" : ""}
                  required
                >
                  <option value="" disabled hidden>
                    Pilih seringnya kegiatan kamu
                  </option>
                  <option value="sedentary">
                    Sangat Jarang (Banyak duduk / tidak berolahraga)
                  </option>
                  <option value="light">
                    Jarang (Olahraga ringan 1 - 2 hari / minggu)
                  </option>
                  <option value="moderate">
                    Cukup Aktif (Olahraga sedang 3 - 5 hari / minggu)
                  </option>
                  <option value="very_active">
                    Sangat Aktif (Olahraga rutin 6 - 7 hari / minggu)
                  </option>
                  <option value="extra_active">
                    Ekstra Aktif (Latihan fisik intensif / atlet)
                  </option>
                </select>
                <ChevronDown size={18} className="pref-select-arrow" />
              </div>
            </div>

            {/* Tombol Konfirmasi */}
            <button type="submit" className="pref-submit-btn">
              Konfirmasi
            </button>

            {/* Navigasi Tambahan dengan Spacing yang Proporsional & Rapi */}
            <div className="pref-nav-footer">
              <a
                href="/"
                onClick={(e) => handleLinkClick(e, "/")}
                className="pref-skip-link"
              >
                Lewati untuk sekarang
              </a>

              <a
                href="/sign-up"
                onClick={(e) => handleLinkClick(e, "/sign-up")}
                className="pref-back-link"
              >
                <ArrowLeft size={14} className="pref-back-icon" />
                <span>Kembali ke Pendaftaran</span>
              </a>
            </div>
          </form>
        </section>
      </main>

      {/* Success Modal */}
      {isSuccess && (
        <div className="pref-modal-backdrop" role="dialog" aria-modal="true">
          <div className="pref-modal-card">
            <div className="pref-modal-icon-wrap">
              <CheckCircle2 size={42} className="pref-modal-check" />
            </div>
            <h2>Data Berhasil Disimpan!</h2>
            <p>
              Terima kasih telah melengkapi data dirimu. AuraSync akan menyesuaikan
              analisis biometrik dan rekomendasi relaksasi sesuai dengan profilmu.
            </p>
            <div className="pref-modal-summary">
              <div className="pref-summary-item">
                <span className="pref-summary-label">Gender:</span>
                <span className="pref-summary-val">
                  {formData.gender === "laki-laki" ? "Laki-Laki ♂" : "Perempuan ♀"}
                </span>
              </div>
              <div className="pref-summary-item">
                <span className="pref-summary-label">Berat / Tinggi:</span>
                <span className="pref-summary-val">
                  {formData.weight} kg / {formData.height} cm
                </span>
              </div>
            </div>
            <button
              type="button"
              className="pref-modal-btn"
              onClick={(e) => handleLinkClick(e, "/")}
            >
              Mulai Eksplorasi AuraSync
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
