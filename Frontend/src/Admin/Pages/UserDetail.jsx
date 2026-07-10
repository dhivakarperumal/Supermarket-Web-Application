import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { FiChevronLeft } from "react-icons/fi";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      setLoading(true);
      try {
        const resp = await api.get("/auth/users");
        const users = resp.data || [];
        const found = users.find(u => String(u.id) === String(id) || String(u.user_id) === String(id));
        if (!found) {
          setUser(null);
          setOrders([]);
          setLoading(false);
          return;
        }
        setUser(found);

        // fetch orders by user_id if available
        const userId = found.user_id || found.user_id || null;
        if (userId) {
          try {
            const ordersResp = await api.get(`/orders/user/${userId}`);
            setOrders(ordersResp.data || []);
          } catch (err) {
            console.error("Failed to fetch user orders:", err);
            setOrders([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!user) return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <FiChevronLeft /> Back
      </button>
      <div className="text-gray-500">User not found</div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600">
        <FiChevronLeft /> Back to users
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || user.name || 'User')}&background=random`} alt={user.name} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.username || user.name}</h2>
            <p className="text-sm text-gray-500">ID: {user.id} {user.user_id ? `(user_id: ${user.user_id})` : ''}</p>
            <p className="text-sm text-gray-600 mt-2">Role: {user.role}</p>
            <p className="text-sm text-gray-600">Status: {user.status}</p>
            <p className="text-sm text-gray-600">Email: {user.email || '—'}</p>
            <p className="text-sm text-gray-600">Phone: {user.phone || '—'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">Orders</h3>
        {orders.length === 0 ? (
          <div className="text-gray-500">No orders found for this user.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-400 uppercase">
                <th className="py-2">Order ID</th>
                <th className="py-2">Status</th>
                <th className="py-2">Total</th>
                <th className="py-2">Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-t">
                  <td className="py-3 text-sm">{o.id}</td>
                  <td className="py-3 text-sm">{o.status}</td>
                  <td className="py-3 text-sm">{o.total || o.amount || '—'}</td>
                  <td className="py-3 text-sm">{o.created_at ? new Date(o.created_at).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
