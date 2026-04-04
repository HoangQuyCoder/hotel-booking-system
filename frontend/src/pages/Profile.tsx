import { useAuth } from "../hooks/useAuth";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Clock,
  Camera,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Banner */}
          <div className="h-48 bg-gradient-to-r from-cyan-600 to-blue-700 relative">
            <div className="absolute -bottom-16 left-8 md:left-12">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2rem] bg-white p-1 shadow-2xl border-4 border-white transition-transform group-hover:scale-105 duration-500 overflow-hidden">
                  {user.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt={user.firstName}
                      className="w-full h-full object-cover rounded-[1.8rem]"
                    />
                  ) : (
                    <div className="w-full h-full bg-cyan-50 flex items-center justify-center text-cyan-600">
                      <User size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-48 md:left-52 text-white">
              <h1 className="text-4xl font-black tracking-tight">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-cyan-100 font-medium opacity-80">
                {user.email}
              </p>
            </div>
          </div>

          <div className="pt-24 pb-12 px-8 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Account details */}
              <div className="space-y-8">
                <h3 className="text-xl font-black text-gray-900 border-b-4 border-cyan-500 w-fit pb-2">
                  Account Details
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-gray-700 group hover:translate-x-1 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-50 transition-colors">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Email Address
                      </p>
                      <p className="font-bold">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-700 group hover:translate-x-1 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-50 transition-colors">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Phone Number
                      </p>
                      <p className="font-bold">
                        {user.phoneNumber || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-700 group hover:translate-x-1 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-50 transition-colors">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Address
                      </p>
                      <p className="font-bold">
                        {user.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Details */}
              <div className="space-y-8">
                <h3 className="text-xl font-black text-gray-900 border-b-4 border-cyan-500 w-fit pb-2">
                  Security & Identity
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="p-3 bg-gray-50 rounded-2xl text-cyan-600">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Role
                      </p>
                      <span className="font-black bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs">
                        {user.roleName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Last Login
                      </p>
                      <p className="text-sm font-bold text-gray-600">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleString()
                          : "Never login before"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2">
                      Member Since
                    </h4>
                    <p className="text-sm text-gray-500">
                      Your account was verified and became part of Theodore
                      community. Enjoy your luxury travels.
                    </p>
                    <p className="text-xs font-black text-cyan-600 mt-4 uppercase tracking-[0.2em]">
                      {new Date(user.createdAt!).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
