import request from "@/utils/request"

/**
 * 发布文章
 * @param {*} article 
 * @returns 
 */
export function addImage(formData) {
    return request({
        url: 'Image',
        method: 'post',
        data: formData,
    });
}

/**
 * 删除文章数据
 * @param {*} id 编号
 */
export function deleteImage(id) {
    return request({
        url: `Image/${id}`,
        method: 'delete'
    });
}