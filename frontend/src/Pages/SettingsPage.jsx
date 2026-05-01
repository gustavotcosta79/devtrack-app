import React, {useEffect, useState} from 'react'

const SettingsPage = ({user, onDeleteUser}) => {

  const [activeTab, setActiveTab] = useState("profile")
  const [editUserData, setEditUserData] = useState(null)

  useEffect(() => {
    if (user){
      setEditUserData(user);
    }
  }, [user]);

  const handleDeleteUser = async (userId) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete your account?`);
    if (!isConfirmed) return;

    console.log("A preparar para apagar user")
    await onDeleteUser(userId);
  }

  const getTabStyle = (tabName) => {
    const isActive = activeTab === tabName;
    return `w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer font-medium border ${
        isActive
            ? "bg-accent border-accent text-white shadow-lg"
            : "bg-secondary border-gray-800 text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;
  };

  return (
      <div className="flex flex-col md:flex-row gap-8 w-full animate-in fade-in duration-500">
        <div className="w-full md:w-64 flex flex-col gap-3 shrink-0">
          <button onClick={() => {setActiveTab("profile"); setEditUserData(user)}}
                  className={getTabStyle("profile")}>
            Profile
          </button>

          <button onClick={() => setActiveTab("appearance")}
                  className={getTabStyle("appearance")}>
            Appearance
          </button>

          <button onClick={() => setActiveTab("account")}
                  className={getTabStyle("account")}>
            Account
          </button>
        </div>

        <div className="flex-1 bg-secondary border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">
          { activeTab === 'profile' ? (
              <div className="flex flex-col gap-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Public Profile</h1>
                  <p className="text-gray-400 text-sm">Manage your public information</p>
                </div>

                <hr className="border-gray-800" />

                {/* Banner de Informação UX */}
                <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-4 flex gap-3 items-start">
                  <span className="text-blue-400 text-xl leading-none">ℹ️</span>
                  <p className="text-blue-300 text-sm">
                    Your profile is automatically sync with Github.
                    If you want to change this data, you need to update your Github profile and sync your profile again.
                  </p>
                </div>

                Username:
                <input type="text" value={editUserData?.username || ""} readOnly={true}
                       className="w-full bg-[#1c2128] border border-gray-700 rounded-lg p-3 text-gray-500 cursor-not-allowed outline-none"
                />
                Email:
                <input type="text" value={editUserData?.email || ""} readOnly={true}
                       className="w-full bg-[#1c2128] border border-gray-700 rounded-lg p-3 text-gray-500 cursor-not-allowed outline-none"
                />
                Avatar:
                <input type="text" value={editUserData?.avatar_url} readOnly={true}
                       className="w-full bg-[#1c2128] border border-gray-700 rounded-lg p-3 text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
          ): activeTab === 'appearance' ? (
              <div> comming soonnnnnnnnnnnnnn</div>
          ) : activeTab === 'account' ? (
              <div>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Account Settings</h1>
                  <p className="text-gray-400 text-sm">Manage your account and data</p>
                </div>
                <hr className="border-gray-800" />
                <div className="border border-red-900/50 bg-red-950/20 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-red-500 mb-2">Danger Zone</h2>
                  <p className="text-gray-300 text-sm mb-6">Once you delete your account there is no going back. All your repositories, DevScore, and profile data will be permanently wiped from our servers. Please be certain.</p>
                  <button onClick={()=> handleDeleteUser(user.id)}
                          className="bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500 hover:border-red-600
                          transition-colors font-bold rounded-lg px-6 py-3 w-full md:w-auto cursor-pointer">
                    Delete Account
                  </button>
                </div>
              </div>

          ) : null
          }
        </div>
      </div>
  )
}
export default SettingsPage


