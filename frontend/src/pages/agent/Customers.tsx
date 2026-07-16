import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiRefreshCw, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";

import Layout from "../../components/Layout";
import AddCustomerModal from "../../components/modals/AddCustomerModal";
import EditCustomerModal from "../../components/modals/EditCustomerModal";

import api from "../../services/api";

import type { Customer, CustomerResponse } from "../../types/customer";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search.trim()) {
      searchCustomers();
    } else {
      fetchCustomers();
    }
  }, [search]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get<CustomerResponse>("/customers");
      setCustomers(res.data.customers);
    } catch {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const searchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get<CustomerResponse>(
        `/customers/search?q=${search}`
      );
      setCustomers(res.data.customers);
    } catch {
      toast.error("Search Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await api.get(`/customers/${id}/edit`);
      setSelectedCustomer(res.data.customer);
      setShowEditModal(true);
    } catch {
      toast.error("Unable to load customer");
    }
  };

  const EditButton = ({ customer }: { customer: Customer }) => (
    <button
      onClick={() => handleEdit(customer.id)}
      className="flex items-center gap-1.5 rounded-lg border border-[#12203A]/10 bg-[#F6F2E9] px-3.5 py-2 text-[13.5px] font-medium text-[#12203A] transition hover:border-[#C9A15D]/50 hover:bg-[#C9A15D]/10"
    >
      <FiEdit size={14} />
      Edit
    </button>
  );

  return (
    <Layout>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#B08A4E]">
            Portfolio
          </p>
          <h2 className="mt-1 font-serif text-[1.7rem] leading-tight text-[#12203A] sm:text-3xl md:text-[2.2rem]">
            Customers
          </h2>
          <p className="mt-1.5 text-sm text-[#6B7690] sm:text-[15px]">
            Manage the people you hold policies for.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={fetchCustomers}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#12203A]/12 bg-white px-5 py-2.5 text-sm font-medium text-[#3D4A66] transition hover:border-[#C9A15D]/50 hover:bg-[#FBF9F3] sm:w-auto"
          >
            <FiRefreshCw size={15} />
            Refresh
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#12203A] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1A2C4D] sm:w-auto"
          >
            <FiPlus size={15} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-xl border border-[#12203A]/8 bg-white p-4 sm:p-5">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA5BD]" />
          <input
            type="text"
            placeholder="Search by name, mobile or Aadhaar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#12203A]/12 py-3 pl-11 pr-4 text-[15px] text-[#12203A] outline-none transition placeholder:text-[#9AA5BD] focus:border-[#C9A15D]/60 focus:ring-2 focus:ring-[#C9A15D]/15"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center rounded-xl border border-[#12203A]/8 bg-white py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#C9A15D]/30 border-t-[#C9A15D]"></div>
        </div>
      ) : customers.length === 0 ? (
        <div className="rounded-xl border border-[#12203A]/8 bg-white py-20 text-center">
          <h2 className="font-serif text-xl text-[#12203A] sm:text-2xl">
            No customers found
          </h2>
          <p className="mt-2 text-sm text-[#6B7690] sm:text-[15px]">
            Try a different name, mobile number or Aadhaar.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile / tablet: card list (below md) */}
          <div className="flex flex-col gap-3.5 md:hidden">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="rounded-xl border border-[#12203A]/8 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium text-[#12203A]">
                      {customer.name}
                    </h3>
                    <p className="text-sm text-[#6B7690]">
                      Age {customer.age}
                    </p>
                  </div>

                  <EditButton customer={customer} />
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-[#12203A]/8 pt-3.5 text-sm">
                  <div>
                    <dt className="text-[12px] text-[#9AA5BD]">Mobile</dt>
                    <dd className="text-[#3D4A66]">{customer.mobile}</dd>
                  </div>

                  <div>
                    <dt className="text-[12px] text-[#9AA5BD]">Aadhaar</dt>
                    <dd className="text-[#3D4A66]">{customer.aadhaar}</dd>
                  </div>

                  <div>
                    <dt className="text-[12px] text-[#9AA5BD]">PAN</dt>
                    <dd className="text-[#3D4A66]">{customer.pan || "—"}</dd>
                  </div>

                  <div>
                    <dt className="text-[12px] text-[#9AA5BD]">Nominee</dt>
                    <dd className="text-[#3D4A66]">{customer.nominee}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          {/* Desktop: table (md and up) */}
          <div className="hidden overflow-x-auto rounded-xl border border-[#12203A]/8 bg-white md:block">
            <table className="w-full min-w-[720px]">
              <thead className="bg-[#F6F2E9]">
                <tr>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Name
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Age
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Mobile
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Aadhaar
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    PAN
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Nominee
                  </th>
                  <th className="px-4 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-[#12203A]/6 transition hover:bg-[#FBF9F3]"
                  >
                    <td className="px-5 py-3.5 font-medium text-[#12203A]">
                      {customer.name}
                    </td>
                    <td className="px-4 py-3.5 text-[#3D4A66]">
                      {customer.age}
                    </td>
                    <td className="px-4 py-3.5 text-[#3D4A66]">
                      {customer.mobile}
                    </td>
                    <td className="px-4 py-3.5 text-[#3D4A66]">
                      {customer.aadhaar}
                    </td>
                    <td className="px-4 py-3.5 text-[#3D4A66]">
                      {customer.pan || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-[#3D4A66]">
                      {customer.nominee}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex justify-center">
                        <EditButton customer={customer} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <AddCustomerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCustomerCreated={fetchCustomers}
      />

      <EditCustomerModal
        isOpen={showEditModal}
        customer={selectedCustomer}
        onClose={() => setShowEditModal(false)}
        onCustomerUpdated={fetchCustomers}
      />
    </Layout>
  );
}