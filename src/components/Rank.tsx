
    const UserProfile = ({ user }: any) => {
        const getRankStyle = (rank: string) => {
            switch (rank) {
                case 'Elite': return { color: '#ffc107', icon: '🏆' };
                case 'Gold': return { color: '#c0c0c0', icon: '🥈' };
                default: return { color: '#cd7f32', icon: '🥉' };
            }
        };

        const style = getRankStyle(user.rank);

        return (
            <div className="d-flex align-items-center gap-2 p-3 bg-white rounded shadow-sm">
                <div className="avatar bg-primary text-white rounded-circle p-2">
                    {user.name.charAt(0)}
                </div>
                <div>
                    <h6 className="mb-0 fw-bold">{user.name}</h6>
                    <small style={{ color: style.color, fontWeight: 'bold' }}>
                        {style.icon} {user.rank} Investor
                    </small>
                </div>
            </div>
        );
    }



export default UserProfile;// USAGE EXAMPLE
// <UserProfile user={{ name: 'Alice Johnson', rank: 'Elite' }} />
