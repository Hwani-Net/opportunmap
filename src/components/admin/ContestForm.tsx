import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import type { Contest, Category } from "../../types/contest";
import { CATEGORY_LABEL } from "../../types/contest";
import { FIELD_OPTIONS, TARGET_OPTIONS, REGION_OPTIONS } from "../../constants";
import { addContest, updateContest } from "../../lib/firestore";

interface ContestFormProps {
  editContest?: Contest;
  onSuccess: () => void;
  onCancel: () => void;
}

type FormData = {
  title: string;
  category: Category;
  organizer: string;
  applicationStart: string;
  applicationEnd: string;
  field: string[];
  target: string[];
  region: string;
  summary: string;
  prize: string;
  eligibility: string;
  applyUrl: string;
  sourceUrl: string;
  checklist: string[];
  isActive: boolean;
};

function timestampToDateString(ts: Timestamp | undefined): string {
  if (!ts) return "";
  const d = ts.toDate();
  return d.toISOString().slice(0, 10);
}

export default function ContestForm({
  editContest,
  onSuccess,
  onCancel,
}: ContestFormProps) {
  const [form, setForm] = useState<FormData>({
    title: editContest?.title ?? "",
    category: editContest?.category ?? "contest",
    organizer: editContest?.organizer ?? "",
    applicationStart: timestampToDateString(editContest?.applicationStart),
    applicationEnd: timestampToDateString(editContest?.applicationEnd),
    field: editContest?.field ?? [],
    target: editContest?.target ?? [],
    region: editContest?.region ?? "전국",
    summary: editContest?.summary ?? "",
    prize: editContest?.prize ?? "",
    eligibility: editContest?.eligibility ?? "",
    applyUrl: editContest?.applyUrl ?? "",
    sourceUrl: editContest?.sourceUrl ?? "",
    checklist: editContest?.checklist ?? [""],
    isActive: editContest?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckboxGroup = (
    field: "field" | "target",
    value: string,
    checked: boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((v) => v !== value),
    }));
  };

  const handleChecklist = (index: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.checklist];
      next[index] = value;
      return { ...prev, checklist: next };
    });
  };

  const addChecklistItem = () => {
    setForm((prev) => ({ ...prev, checklist: [...prev.checklist, ""] }));
  };

  const removeChecklistItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.applicationStart || !form.applicationEnd) {
      setError("제목, 신청 시작일, 마감일은 필수입니다.");
      return;
    }
    if (new Date(form.applicationStart) >= new Date(form.applicationEnd)) {
      setError("마감일은 시작일보다 이후여야 합니다.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        applicationStart: Timestamp.fromDate(new Date(form.applicationStart)),
        applicationEnd: Timestamp.fromDate(new Date(form.applicationEnd)),
        checklist: form.checklist.filter((c) => c.trim() !== ""),
      };
      if (editContest) {
        await updateContest(editContest.id, payload);
      } else {
        await addContest(payload);
      }
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.",
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#3B5BDB]/30 bg-white";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}
      >
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <h2
            className="text-lg"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              color: "#1A1A2E",
            }}
          >
            {editContest ? "공고 수정" : "공고 추가"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {/* 제목 */}
          <div>
            <label className={labelClass}>제목 *</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="공고 제목"
            />
          </div>

          {/* 카테고리 + 주최 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>카테고리</label>
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    category: e.target.value as Category,
                  }))
                }
              >
                {(Object.keys(CATEGORY_LABEL) as Category[]).map((k) => (
                  <option key={k} value={k}>
                    {CATEGORY_LABEL[k]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>주최</label>
              <input
                className={inputClass}
                value={form.organizer}
                onChange={(e) =>
                  setForm((p) => ({ ...p, organizer: e.target.value }))
                }
                placeholder="주최 기관명"
              />
            </div>
          </div>

          {/* 신청 기간 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>신청 시작일 *</label>
              <input
                type="date"
                className={inputClass}
                value={form.applicationStart}
                onChange={(e) =>
                  setForm((p) => ({ ...p, applicationStart: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>마감일 *</label>
              <input
                type="date"
                className={inputClass}
                value={form.applicationEnd}
                onChange={(e) =>
                  setForm((p) => ({ ...p, applicationEnd: e.target.value }))
                }
              />
            </div>
          </div>

          {/* 분야 */}
          <div>
            <label className={labelClass}>분야 (복수 선택)</label>
            <div className="flex flex-wrap gap-2">
              {FIELD_OPTIONS.map((f) => (
                <label
                  key={f}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.field.includes(f)}
                    onChange={(e) =>
                      handleCheckboxGroup("field", f, e.target.checked)
                    }
                    className="accent-[#3B5BDB]"
                  />
                  <span className="text-sm text-[#1A1A2E]">{f}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 대상 */}
          <div>
            <label className={labelClass}>대상 (복수 선택)</label>
            <div className="flex flex-wrap gap-2">
              {TARGET_OPTIONS.map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.target.includes(t)}
                    onChange={(e) =>
                      handleCheckboxGroup("target", t, e.target.checked)
                    }
                    className="accent-[#3B5BDB]"
                  />
                  <span className="text-sm text-[#1A1A2E]">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 지역 */}
          <div>
            <label className={labelClass}>지역</label>
            <select
              className={inputClass}
              value={form.region}
              onChange={(e) =>
                setForm((p) => ({ ...p, region: e.target.value }))
              }
            >
              {REGION_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* 요약 */}
          <div>
            <label className={labelClass}>요약</label>
            <textarea
              className={inputClass}
              rows={3}
              value={form.summary}
              onChange={(e) =>
                setForm((p) => ({ ...p, summary: e.target.value }))
              }
              placeholder="공고 요약 설명"
            />
          </div>

          {/* 시상 + 지원자격 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>시상 내용</label>
              <input
                className={inputClass}
                value={form.prize}
                onChange={(e) =>
                  setForm((p) => ({ ...p, prize: e.target.value }))
                }
                placeholder="예: 대상 500만원"
              />
            </div>
            <div>
              <label className={labelClass}>지원 자격</label>
              <input
                className={inputClass}
                value={form.eligibility}
                onChange={(e) =>
                  setForm((p) => ({ ...p, eligibility: e.target.value }))
                }
                placeholder="예: 대학생 이상"
              />
            </div>
          </div>

          {/* URL */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>신청 URL</label>
              <input
                className={inputClass}
                value={form.applyUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, applyUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
            <div>
              <label className={labelClass}>원문 URL</label>
              <input
                className={inputClass}
                value={form.sourceUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, sourceUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
          </div>

          {/* 체크리스트 */}
          <div>
            <label className={labelClass}>체크리스트</label>
            <div className="space-y-2">
              {form.checklist.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={inputClass}
                    value={item}
                    onChange={(e) => handleChecklist(i, e.target.value)}
                    placeholder={`체크리스트 항목 ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(i)}
                    className="text-red-400 hover:text-red-600 px-2 text-sm shrink-0"
                  >
                    삭제
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addChecklistItem}
                className="text-[#3B5BDB] text-sm font-semibold hover:underline"
              >
                + 항목 추가
              </button>
            </div>
          </div>

          {/* 활성 여부 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) =>
                setForm((p) => ({ ...p, isActive: e.target.checked }))
              }
              className="accent-[#3B5BDB]"
            />
            <label
              htmlFor="isActive"
              className="text-sm text-[#1A1A2E] font-medium"
            >
              활성화 (목록에 표시)
            </label>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg font-semibold text-white text-sm transition-opacity"
              style={{ backgroundColor: "#3B5BDB", opacity: saving ? 0.6 : 1 }}
            >
              {saving ? "저장 중..." : editContest ? "수정 완료" : "공고 추가"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
