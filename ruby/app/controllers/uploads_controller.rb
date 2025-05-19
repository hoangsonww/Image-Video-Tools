module Controllers
  class UploadsController
    def self.list
      Models::Upload.where(user_id: @current_user.id).map do |u|
        { id: u.id.to_s, tool: u.tool, in: u.input_path, out: u.output_path, at: u.created_at }
      end.to_json
    end

    def self.destroy(id)
      up = Models::Upload.find(id)
      halt 403 unless up.user_id == @current_user.id
      up.destroy
      { success: true }.to_json
    end
  end
end
