import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-toastify";

import Layout from "../../components/Layout";
import AddPolicyModal from "../../components/modals/AddPolicyModal";
import EditPolicyModal from "../../components/modals/EditPolicyModal";

import api from "../../services/api";

import type { Policy, PolicyResponse } from "../../types/policy";

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await api.get<PolicyResponse>("/policies");
      setPolicies(res.data.policies);
    } catch {
      toast.error("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await api.get(`/policies/${id}`);
      setSelectedPolicy(res.data.policy);
      setShowEditModal(true);
    } catch {
      toast.error("Unable to load policy");
    }
  };

  const statusClasses = (status: Policy["status"]) =>
    status === "Active"
      ? "bg-[#2F6B4F]/10 text-[#2F6B4F]"
      : status === "Expired"
      ? "bg-[#B08A4E]/15 text-[#8A6A2F]"
      : "bg-[#B4482E]/10 text-[#B4482E]";

  const statusDot = (status: Policy["status"]) =>
    status === "Active"
      ? "bg-[#2F6B4F]"
      : status === "Expired"
      ? "bg-[#B08A4E]"
      : "bg-[#B4482E]";

  const EditButton = ({ policy }: { policy: Policy }) => (
    <button
      onClick={() => handleEdit(policy.id)}
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
            Policies
          </h2>
          <p className="mt-1.5 text-sm text-[#6B7690] sm:text-[15px]">
            Manage insurance policies you've issued.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={fetchPolicies}
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
            Issue Policy
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center rounded-xl border border-[#12203A]/8 bg-white py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#C9A15D]/30 border-t-[#C9A15D]"></div>
        </div>
      ) : policies.length === 0 ? (
        <div className="rounded-xl border border-[#12203A]/8 bg-white py-20 text-center">
          <h2 className="font-serif text-xl text-[#12203A] sm:text-2xl">
            No policies found
          </h2>
          <p className="mt-2 text-sm text-[#6B7690] sm:text-[15px]">
            Policies you issue will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile / tablet: card list (below md) */}
          <div className="flex flex-col gap-3.5 md:hidden">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="rounded-xl border border-[#12203A]/8 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-medium text-[#12203A]">
                      {policy.customer.name}
                    </h3>
                    <p className="text-sm text-[#6B7690]">
                      {policy.policyType}
                    </p>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${statusClasses(
                      policy.status
                    )}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${statusDot(
                        policy.status
                      )}`}
                    />
                    {policy.status}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-[#12203A]/8 pt-3.5 text-sm">
                  <div>
                    <dt className="text-[12px] text-[#9AA5BD]">Premium</dt>
                    <dd className="font-medium text-[#12203A]">
                      ₹{policy.premium.toLocaleString()}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[12px] text-[#9AA5BD]">Term</dt>
                    <dd className="text-[#3D4A66]">
                      {policy.policyTerm} years
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[12px] text-[#9AA5BD]">Frequency</dt>
                    <dd className="text-[#3D4A66]">
                      {policy.premiumFrequency}
                    </dd>
                  </div>
                </dl>

                <div className="mt-3.5 flex justify-end border-t border-[#12203A]/8 pt-3.5">
                  <EditButton policy={policy} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table (md and up) */}
          <div className="hidden overflow-x-auto rounded-xl border border-[#12203A]/8 bg-white md:block">
            <table className="w-full min-w-[760px]">
              <thead className="bg-[#F6F2E9]">
                <tr>
                  <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Customer
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Policy
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Premium
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Term
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Frequency
                  </th>
                  <th className="px-4 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-center text-[11px] font-semibold uppercase tracking-wider text-[#8593AC]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {policies.map((policy) => (
                  <tr
                    key={policy.id}
                    className="border-t border-[#12203A]/6 transition hover:bg-[#FBF9F3]"
                  >
                    <td className="px-5 py-3.5 font-medium text-[#12203A]">
                      {policy.customer.name}
                    </td>

                    <td className="px-4 py-3.5 text-[#3D4A66]">
                      {policy.policyType}
                    </td>

                    <td className="px-4 py-3.5 font-medium text-[#12203A]">
                      ₹{policy.premium.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 text-[#3D4A66]">
                      {policy.policyTerm} years
                    </td>

                    <td className="px-4 py-3.5 text-[#3D4A66]">
                      {policy.premiumFrequency}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium ${statusClasses(
                          policy.status
                        )}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${statusDot(
                            policy.status
                          )}`}
                        />
                        {policy.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex justify-center">
                        <EditButton policy={policy} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <AddPolicyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onPolicyCreated={fetchPolicies}
      />

      <EditPolicyModal
        isOpen={showEditModal}
        policy={selectedPolicy}
        onClose={() => setShowEditModal(false)}
        onPolicyUpdated={fetchPolicies}
      />
    </Layout>
  );
}