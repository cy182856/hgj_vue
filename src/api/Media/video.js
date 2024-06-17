import request from "@/utils/request"

/**
 * 发布文章
 * @param {*} article 
 * @returns 
 */
export function addVideo(formData) {
    return request({
        url: 'Video',
        method: 'post',
        data: formData,
    });
}

/**
 * 删除文章数据
 * @param {*} id 编号
 */
export function deleteVideo(id) {
    return request({
        url: `Video/${id}`,
        method: 'delete'
    });
}