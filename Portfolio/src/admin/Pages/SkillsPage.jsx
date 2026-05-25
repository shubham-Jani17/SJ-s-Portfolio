import useAdminPortfolio from "../hooks/useAdminPortfolio";
import {
  AdminCard,
  AdminCardSave,
  AdminField,
  AdminPage,
  adminInputClass,
} from "../components/AdminUi";

export default function SkillsPage() {
  const { portfolio, loading, saving, setPortfolio, save, isSaving, cardStatus } =
    useAdminPortfolio();
  if (loading || !portfolio) return <p className="text-muted-foreground">Loading…</p>;

  const skills = portfolio.skills || portfolio.skillsSection?.categories || [];
  const setSkills = (patch) => setPortfolio((p) => ({ ...p, skills: patch }));

  // ── Add a brand-new empty category ──────────────────────────────────────
  function addCategory() {
    setSkills([
      ...skills,
      { name: "", items: [{ name: "", level: 50 }] },
    ]);
  }

  return (
    <AdminPage
      title="Skills"
      subtitle="Edit each card and save independently. Changes sync to the public portfolio."
      actions={
        <button
          type="button"
          onClick={addCategory}
          className="rounded-full bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 hover:border-cyan-400/60 text-cyan-400 px-4 py-2 text-sm font-medium transition-all"
        >
          + New Category
        </button>
      }
    >
      {skills.map((cat, ci) => {
        const scope = `skills-category-${ci}`;
        return (
          <AdminCard key={ci} title={`Category: ${cat.name}`}>
            {/* Category name */}
            <AdminField label="Category name">
              <input
                className={adminInputClass}
                placeholder="e.g. New category"
                value={cat.name}
                onChange={(e) => {
                  const newSkills = [...skills];
                  newSkills[ci] = { ...newSkills[ci], name: e.target.value };
                  setSkills(newSkills);
                }}
              />
            </AdminField>

            {/* Skills list */}
            {(cat.items || []).map((item, ii) => (
              <div key={ii} className="grid sm:grid-cols-[1fr_80px] gap-2 mb-2">
                <input
                  className={adminInputClass}
                  placeholder="e.g. New skill"
                  value={item.name}
                  onChange={(e) => {
                    const newSkills = structuredClone(skills);
                    newSkills[ci].items[ii].name = e.target.value;
                    setSkills(newSkills);
                  }}
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={adminInputClass}
                  placeholder="%"
                  value={item.level}
                  onChange={(e) => {
                    const newSkills = structuredClone(skills);
                    newSkills[ci].items[ii].level = Number(e.target.value);
                    setSkills(newSkills);
                  }}
                />
              </div>
            ))}

            {/* Add skill */}
            <button
              type="button"
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={() => {
                const newSkills = structuredClone(skills);
                if (!newSkills[ci].items) newSkills[ci].items = [];
                newSkills[ci].items.push({ name: "", level: 50 });
                setSkills(newSkills);
              }}
            >
              + Add skill
            </button>

            {/* Per-card save */}
            <AdminCardSave
              onSave={() => save(scope)}
              saving={isSaving(scope)}
              saveLocked={saving}
              {...cardStatus(scope)}
            />
          </AdminCard>
        );
      })}
    </AdminPage>
  );
}
