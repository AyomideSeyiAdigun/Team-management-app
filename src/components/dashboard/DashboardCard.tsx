type Props = {
  title: string;
  count: number;
  icon: string;
  color?: string;
};

const DashboardCard: React.FC<Props> = ({ title, count, icon, color }) => {
  return (
    <div className={`rounded-xl p-4 text-white shadow-md ${color || "bg-gray-800"}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">
            {title}
          </h3>
          <p className="text-2xl font-bold">{count}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
